import fs from 'fs'
import path from 'path'

const dataDir = path.resolve(__dirname, '..', '..', 'data')

function filePath(name: string) {
  return path.join(dataDir, `${name}.json`)
}

export function readJson(name: string): any[] {
  const file = filePath(name)
  if (!fs.existsSync(file)) return []
  try {
    const raw = fs.readFileSync(file, { encoding: 'utf8' })
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

export function writeJson(name: string, data: any[]) {
  const file = filePath(name)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), { encoding: 'utf8' })
}
