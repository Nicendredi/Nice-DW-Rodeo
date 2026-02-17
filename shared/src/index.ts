/**
 * Shared type definitions for Nice DW Rodeo
 */

/**
 * Result of a dice roll, as produced by dice-roller-parser.
 * This represents the detailed breakdown of a roll expression.
 * Properties vary by implementation, so we use a flexible record type.
 */
export type DiceRoll = Record<string, unknown>

/**
 * Verification information for a roll, comparing client and server results.
 */
export interface RollVerification {
  match?: boolean
  verified?: boolean
  client_total?: number | null
  client_detail?: DiceRoll | null
  server_total?: number | null
  server_detail?: DiceRoll | null
}

/**
 * A recorded roll with its details and optional verification.
 */
export interface RollRecord {
  id?: string
  move_id?: string | null
  expression: string
  rolls: DiceRoll | null
  total: number | null
  verification?: RollVerification
  created_at?: string
}

/**
 * Response from roll API, either a direct record or split record + verification.
 */
export type RollResponse = RollRecord | { record: RollRecord; verification: RollVerification };
