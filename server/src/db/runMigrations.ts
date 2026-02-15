import fs from 'fs'
import path from 'path'

const dataDir = path.resolve(__dirname, '..', '..', 'data')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function writeEmpty(name: string, initial: unknown) {
  const file = path.join(dataDir, `${name}.json`)
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(initial, null, 2), { encoding: 'utf8' })
    console.log('Created', file)
  } else {
    console.log('Exists', file)
  }
}

function run() {
  ensureDir(dataDir)

  writeEmpty('users', [])
  writeEmpty('campaigns', [])
  writeEmpty('character_sheets', [])
  writeEmpty('moves', [])
  writeEmpty('roll_history', [])
  writeEmpty('translations', [])

  console.log('JSON-based migrations applied to', dataDir)
}

if (require.main === module) {
  try {
    run()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Migration error:', err)
    process.exit(1)
  }
}

export default run
