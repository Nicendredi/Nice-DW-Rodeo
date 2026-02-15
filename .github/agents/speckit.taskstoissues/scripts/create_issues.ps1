# Creates GitHub issues from .github/issues/001-owlbear-tasks.json using gh CLI
# Usage: from repo root in PowerShell (or pwsh): `pwsh .\.github\agents\speckit.taskstoissues\scripts\create_issues.ps1`

param(
  [string]$dataPath = ".github/issues/001-owlbear-tasks.json"
)

if (-not (Test-Path $dataPath)) {
  Write-Error "Issue payload file not found: $dataPath"
  exit 1
}

$json = Get-Content -Raw -Encoding UTF8 $dataPath | ConvertFrom-Json
$repo = gh repo view --json nameWithOwner -q .nameWithOwner
if (-not $repo) {
  Write-Error "Failed to determine repo. Run `gh auth login` and ensure you're in the repo directory";
  exit 1
}

# Detect whether `gh issue create` supports --json (older CLI versions may not)
$helpOut = & gh issue create --help 2>&1
$supportsCreateJson = $false
if ($helpOut -and ($helpOut -match '--json')) { $supportsCreateJson = $true }

# Collect unique labels from payload
$allLabels = [System.Collections.Generic.HashSet[string]]::new()
foreach ($item in $json) {
  foreach ($lbl in $item.labels) { $allLabels.Add($lbl) | Out-Null }
}

# Ensure labels exist in the repo (create if missing)
function Get-LabelColorAndDesc($label) {
  switch ($label) {
    'spec' { return @{ color='FF9F1C'; desc='Specification tasks' } }
    'mvp' { return @{ color='0E8A16'; desc='Minimum viable product' } }
    'optional' { return @{ color='6e5494'; desc='Optional task' } }
    default {
      if ($label -match '^\d') { return @{ color='0366d6'; desc='Estimated duration label' } }
      return @{ color='cccccc'; desc='Auto-created label' }
    }
  }
}

foreach ($lbl in $allLabels) {
  if (-not $lbl) { continue }
  $exists = & gh label view $lbl --repo $repo 2>$null
  if ($LASTEXITCODE -ne 0) {
    $meta = Get-LabelColorAndDesc $lbl
    Write-Output "Creating label: $lbl"
    & gh label create $lbl --color $meta.color --description $meta.desc --repo $repo
  }
}

foreach ($item in $json) {
  $labelArgs = @()
  foreach ($lbl in $item.labels) {
    $labelArgs += "--label"
    $labelArgs += $lbl
  }
  Write-Output "Creating: $($item.title)"
  $tmp = [System.IO.Path]::GetTempFileName()
  Set-Content -Path $tmp -Value $item.body -Encoding UTF8
  if ($supportsCreateJson) {
    $args = @('--repo', $repo, '--title', $item.title, '--body-file', $tmp) + $labelArgs + @('--json','number')
    $out = & gh issue create @args 2>&1
    try {
      $created = $out | ConvertFrom-Json
      $number = $created.number
    } catch {
      Write-Error "Failed to parse gh JSON output for issue creation: $out"
      $number = $null
    }
  } else {
    # Fallback: create issue and parse the printed URL or text for the issue number
    $args = @('--repo', $repo, '--title', $item.title, '--body-file', $tmp) + $labelArgs
    $out = & gh issue create @args 2>&1
    $number = $null
    if ($out -match '/issues/(\d+)') { $number = $matches[1] }
    elseif ($out -match '#(\d+)') { $number = $matches[1] }
    else { Write-Error "Failed to extract issue number from gh output: $out" }
  }
  if ($number) {
    if (-not $script:createdMap) { $script:createdMap = @{} }
    $key = if ($item.PSObject.Properties.Name -contains 'id') { $item.id } else { $item.title }
    $script:createdMap[$key] = $number
    Write-Output "Created issue #$number for '$($item.title)' (key=$key)"
  }
  Remove-Item $tmp -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
}

if ($script:createdMap) {
  # Write created mapping to a temp file so dependency application can be optional
  $mapTmp = [System.IO.Path]::GetTempFileName()
  $jsonMap = $script:createdMap | ConvertTo-Json -Depth 4
  Set-Content -Path $mapTmp -Value $jsonMap -Encoding UTF8
  Write-Output "Wrote created issue map to: $mapTmp"
  Write-Output "To apply dependencies run: pwsh .\.github\agents\speckit.taskstoissues\scripts\apply_issues_depencies.ps1 -mapFile '$mapTmp'"
} else {
  Write-Warning "No created issues map available. Nothing to export."
}

Write-Output "Done. Created issues (dependency application is optional)."
