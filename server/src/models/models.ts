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
  owner_id: string
  campaign_id?: string
  name: string
  attributes: Record<string, number>
  moves: string[]
  created_at?: string
}

export interface Move {
  id: string
  name: { en: string; fr?: string }
  description: { en: string; fr?: string }
  dice_expression?: string
  created_at?: string
}

export interface RollHistory {
  id: string
  move_id?: string
  sheet_id?: string
  executed_by?: string
  dice_expression: string
  individual_results: number[]
  total: number
  result_text?: { en?: string; fr?: string }
  created_at?: string
}

export interface TranslationEntry {
  key: string
  context?: string
  en?: string
  fr?: string
  updated_by?: string
  updated_at?: string
}

export default {}
