param(
    [string]$mapFile,
    [string]$tasksFile = ".github/issues/001-owlbear-tasks.json"
)

if (-not $mapFile) {
    Write-Error 'Usage: pwsh .\scripts\apply_issues_depencies.ps1 -mapFile <path-to-created-map.json> [-tasksFile <path>]'
    exit 1
}

if (-not (Test-Path $mapFile)) {
    Write-Error "Map file not found: $mapFile"
    exit 1
}

if (-not (Test-Path $tasksFile)) {
    Write-Error "Tasks file not found: $tasksFile"
    exit 1
}

$repo = gh repo view --json nameWithOwner -q .nameWithOwner
if (-not $repo) {
    Write-Error 'Failed to determine repo. Run `gh auth login` and ensure you''re in the repo directory.'
    exit 1
}

# Read mapping and tasks
$map = Get-Content -Raw -Encoding UTF8 $mapFile | ConvertFrom-Json
$tasks = Get-Content -Raw -Encoding UTF8 $tasksFile | ConvertFrom-Json

for ($i = 0; $i -lt $tasks.Count; $i++) {
    $item = $tasks[$i]
    if (-not ($item.PSObject.Properties.Name -contains 'depends_on')) { continue }

    if ($item.PSObject.Properties.Name -contains 'id') { $parentKey = $item.id } else { $parentKey = $item.title }

    $parentNumber = $null
    if ($map.PSObject.Properties.Name -contains $parentKey) {
        $parentNumber = $map.$parentKey
    } elseif ($map.PSObject.Properties.Name -contains $item.title) {
        $parentNumber = $map.$($item.title)
    }

    if (-not $parentNumber) {
        Write-Warning "Skipping $parentKey - no created issue number found"
        continue
    }

    $depEntries = @()
    for ($j = 0; $j -lt $item.depends_on.Count; $j++) {
        $dep = $item.depends_on[$j]
        if ($map.PSObject.Properties.Name -contains $dep) {
            $num = $map.$dep
            $depEntries += "$dep (#$num)"
        } else {
            Write-Warning "Dependency key not found in map: $dep (skipping)"
        }
    }

    if ($depEntries.Count -eq 0) { continue }

    $comment = 'Blocked by ' + ($depEntries -join ', ')
    Write-Output "Posting comment on issue #$parentNumber - $comment"
    & gh issue comment $parentNumber --repo $repo --body $comment
}

Write-Output 'Done applying dependency comments.'
