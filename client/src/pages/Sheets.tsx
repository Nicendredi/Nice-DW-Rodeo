import React, { useEffect, useState } from 'react'
import { listSheets, createSheet, deleteSheet, SheetPayload } from '../api/sheets'

type Props = {
  onSelect?: (sheet: any) => void
  onChange?: (createdOrNull: any | null) => void
  reloadToken?: number
}

export default function Sheets({ onSelect, onChange, reloadToken }: Props): JSX.Element {
  const [sheets, setSheets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await listSheets()
      setSheets(Array.isArray(data) ? data : [])
      try {
        const ures = await fetch('/api/users')
        if (ures.ok) {
          const ujson = await ures.json()
          setUsers(Array.isArray(ujson) ? ujson : [])
        }
      } catch (e) {
        // ignore user load errors
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [reloadToken])

  async function handleCreate() {
    if (!newName.trim()) return
    const payload: SheetPayload = { name: newName.trim(), attributes: {}, moves: [] }
    try {
      const created = await createSheet(payload)
      setNewName('')
      onChange?.(created)
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this sheet?')) return
    try {
      await deleteSheet(id)
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  return (
    <section>
      <h2>Sheets</h2>
      <div style={{ marginBottom: 12 }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New sheet name" />
        <button onClick={handleCreate} style={{ marginLeft: 8 }}>Create</button>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {sheets.map((s) => {
            const owner = users.find((u) => u.id === s.owner_id)
            const ownerName = owner ? (owner.name || owner.display_name || owner.id) : (s.owner_id || '—')
            return (
              <li key={s.id}>
                <strong style={{ cursor: 'pointer' }} onClick={() => onSelect?.(s)}>{s.name}</strong> — <small>{ownerName}</small>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: 8 }}>Delete</button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
