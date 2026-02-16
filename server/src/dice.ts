import { DiceRoller } from '@3d-dice/dice-roller-parser'
import { readJson, writeJson } from './db/jsonStore'
import crypto from 'crypto'

// Mulberry32 PRNG for deterministic tests
export function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function parseDiceExpression(expr: string, seed?: number | string) {
  try {
    // basic safety: clamp total dice count to prevent DoS via huge expressions
    const MAX_DICE = 100
    try {
      const diceRegex = /([0-9]+)\s*d\s*[0-9]+/gi
      let totalDice = 0
      let m: RegExpExecArray | null
      while ((m = diceRegex.exec(expr)) !== null) {
        const c = parseInt(m[1], 10)
        totalDice += Number.isFinite(c) ? c : 0
        if (totalDice > MAX_DICE) return { valid: false, error: `too many dice (>${MAX_DICE})` }
      }
    } catch (e) {
      // fallthrough to parser errors below
    }
    // If a seed is provided, create a seeded PRNG and pass to DiceRoller
    let randFn: (() => number) | undefined = undefined
    if (seed !== undefined && seed !== null) {
      // simple 32-bit seed from string/number
      const n = typeof seed === 'number' ? seed : [...String(seed)].reduce((a, c) => a * 31 + c.charCodeAt(0), 0)
      randFn = mulberry32(n >>> 0)
    }

    const roller = randFn ? new DiceRoller(randFn) : new DiceRoller()
    const rollObj = roller.roll(String(expr))
    // try to extract a total value (property names vary by implementation)
    const total = (rollObj && (rollObj.value ?? null))
    return { valid: true, detail: rollObj, total }
  } catch (err: any) {
    return { valid: false, error: err && err.message ? err.message : String(err) }
  }
}

export function createRollRecord(moveId: string | null, expression: string, rolls: any, total: number) {
  const roll_history = readJson('roll_history')
  const id = (crypto as any).randomUUID()
  const now = new Date().toISOString()
  const rec = { id, move_id: moveId, expression, rolls, total, created_at: now }
  roll_history.push(rec)
  writeJson('roll_history', roll_history)
  return rec
}
