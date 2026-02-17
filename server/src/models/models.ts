import type { DiceRoll } from '@nice-dw-rodeo/shared'

export interface User {
  id: string
  username: string
  email?: string
  created_at?: string
}

export interface Campaign {
  id: string
  name: string
  owner_id: string
  created_at?: string
}

export interface CharacterSheet {
  id: string
  owner_id?: string | null
  campaign_id?: string | null
  name: string
  attributes?: Record<string, number>
  moves?: string[]
  created_at?: string
}

export interface Move {
  id: string
  name?: string
  name_en?: string
  name_fr?: string | null
  description?: string | null
  description_en?: string | null
  description_fr?: string | null
  dice_expression?: string | null
  created_at?: string
  translation_missing?: boolean
}

export interface RollHistory {
  id: string
  move_id?: string | null
  expression: string
  rolls: DiceRoll
  total: number | null
  verification?: {
    client_total?: number | null
    client_detail?: unknown
    server_total?: number | null
    server_detail?: unknown
    verified?: boolean
  }
  created_at?: string
}

export default {}
