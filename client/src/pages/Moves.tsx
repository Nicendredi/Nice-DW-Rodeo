import React, { useEffect, useState } from 'react'
import { listMoves, createMove, updateMove, deleteMove, StoredMove } from '../api/moves'

export default function Moves(): JSX.Element {
  const [moves, setMoves] = useState<StoredMove[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<StoredMove | null>(null)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newDice, setNewDice] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await listMoves()
      setMoves(Array.isArray(data) ? data : [])
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate() {
    if (!newName.trim()) return
    try {
      await createMove({ name_en: newName.trim(), description_en: newDesc.trim() || null, dice_expression: newDice.trim() || null })
      setNewName('')
      setNewDesc('')
      setNewDice('')
      await load()
    } catch (err) { console.error(err) }
  }

  async function handleSaveEdit() {
    if (!editing || !editing.id) return
    try {
      await updateMove(editing.id, editing)
      setEditing(null)
      await load()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id?: string) {
    if (!id || !confirm('Delete stored move?')) return
    try {
      await deleteMove(id)
      await load()
    } catch (err) { console.error(err) }
  }

  return (
    <section>
      <h2>Stored Moves</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <input placeholder="dice expr" value={newDice} onChange={(e) => setNewDice(e.target.value)} style={{ marginLeft: 8, width: 120 }} />
        <input placeholder="description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ marginLeft: 8 }} />
        <button style={{ marginLeft: 8 }} onClick={handleCreate}>Create Move</button>
      </div>
      {loading ? <p>Loading…</p> : (
        <ul>
          {moves.map((m) => (
            <li key={m.id}>
              <strong>{m.name_en}</strong>
              <div><small>{m.dice_expression ?? ''} {m.created_at ? `• ${new Date(m.created_at).toLocaleString()}` : ''}</small></div>
              <div>
                <button style={{ marginLeft: 8 }} onClick={() => setEditing(m)}>Edit</button>
                <button style={{ marginLeft: 8 }} onClick={() => handleDelete(m.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div style={{ marginTop: 12, borderTop: '1px solid #ddd', paddingTop: 12 }}>
          <h3>Edit Move</h3>
          <div>
            <label>Name EN: <input value={editing.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></label>
          </div>
          <div>
            <label>Dice Expression: <input value={editing.dice_expression || ''} onChange={(e) => setEditing({ ...editing, dice_expression: e.target.value })} /></label>
          </div>
          <div>
            <label>Description EN: <input value={editing.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></label>
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={handleSaveEdit}>Save</button>
            <button style={{ marginLeft: 8 }} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  )
}
