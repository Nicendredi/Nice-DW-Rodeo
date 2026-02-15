export interface StoredMove {
  id?: string
  name_en?: string
  name_fr?: string | null
  description_en?: string | null
  description_fr?: string | null
  dice_expression?: string | null
  created_at?: string
}

const BASE = '/api'

export async function listMoves() {
  const res = await fetch(`${BASE}/moves`)
  if (!res.ok) throw new Error('Failed to fetch moves')
  return res.json() as Promise<StoredMove[]>
}

export async function getMove(id: string) {
  const res = await fetch(`${BASE}/moves/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Not found')
  return res.json() as Promise<StoredMove>
}

export async function createMove(payload: Partial<StoredMove>) {
  const res = await fetch(`${BASE}/moves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Create failed')
  return res.json() as Promise<StoredMove>
}

export async function updateMove(id: string, payload: Partial<StoredMove>) {
  const res = await fetch(`${BASE}/moves/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json() as Promise<StoredMove>
}

export async function deleteMove(id: string) {
  const res = await fetch(`${BASE}/moves/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}

export async function rollMove(id: string, expression?: string, seed?: number | string) {
  const body: any = { expression }
  if (seed !== undefined) body.seed = seed
  const res = await fetch(`${BASE}/moves/${encodeURIComponent(id)}/roll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Roll failed')
  return res.json() as Promise<any>
}

export async function rollExpression(expression: string) {
  const res = await fetch(`${BASE}/roll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  })
  if (!res.ok) throw new Error('Roll failed')
  return res.json() as Promise<any>
}
