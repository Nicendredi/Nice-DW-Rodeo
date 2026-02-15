export interface SheetPayload {
  id?: string
  owner_id?: string | null
  campaign_id?: string | null
  name: string
  attributes?: Record<string, number>
  moves?: string[]
}

const BASE = '/api'

export async function listSheets() {
  const res = await fetch(`${BASE}/sheets`)
  if (!res.ok) throw new Error('Failed to fetch sheets')
  return res.json()
}

export async function getSheet(id: string) {
  const res = await fetch(`${BASE}/sheets/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export async function createSheet(payload: SheetPayload) {
  const res = await fetch(`${BASE}/sheets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Create failed')
  return res.json()
}

export async function updateSheet(id: string, payload: Partial<SheetPayload>) {
  const res = await fetch(`${BASE}/sheets/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

export async function deleteSheet(id: string) {
  const res = await fetch(`${BASE}/sheets/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}
