import React, { useEffect, useState } from 'react'
import { listMoves, createMove, updateMove, deleteMove, rollMove, StoredMove } from '../api/moves'

export default function Moves(): JSX.Element {
  const [moves, setMoves] = useState<StoredMove[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<StoredMove | null>(null)
  const [lastRolls, setLastRolls] = useState<Record<string, any>>({})
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
      <h4 style={{ display: 'none' }}>Stored Moves</h4>

      {loading ? <p>Loading…</p> : (
        <>
          {moves.map((m) => (
            <details key={m.id} open={editing?.id === m.id}>
              <summary>{m.name_en}</summary>
              <p>{m.description_en}</p>
              <aside>
              <div><small>{m.dice_expression ?? ''} {m.created_at ? `• ${new Date(m.created_at).toLocaleString()}` : ''}</small></div>
              </aside>
                  <button style={{ marginLeft: 8 }} onClick={() => setEditing(m)}>Edit</button>
                  <button style={{ marginLeft: 8 }} onClick={() => handleDelete(m.id)}>Delete</button>
                  {m.id && (
                    <button style={{ marginLeft: 8 }} onClick={async () => {
                      try {
                        const res = await rollMove(m.id!, m.dice_expression || undefined)
                        setLastRolls(prev => ({ ...prev, [m.id!]: res }))
                      } catch (err) { console.error(err) }
                    }}>Roll</button>
                  )}
                  <details style={{ border: 'none', boxShadow: 'none', padding: 0, margin: '0.5em 0 0 1em' }}>
                    <summary style={{ background: '#222', color: '#fff', padding: '4px 6px', borderRadius: 4 }}>Last roll (raw data)</summary>
                    {m.id && lastRolls[m.id] && (
                      <div style={{ marginTop: 8, padding: 8 }}>
                        <div><strong>Result:</strong> {String(lastRolls[m.id].total ?? lastRolls[m.id].value ?? '')}</div>
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(lastRolls[m.id].rolls ?? lastRolls[m.id].detail ?? lastRolls[m.id], null, 2)}</pre>
                      </div>
                    )}
                  </details>
            </details>
          ))}
        </>
      )}

      <nav aria-label="compendium filters">
        <h4>Filters</h4>
        <form onSubmit={(e) => { e.preventDefault(); /* filter logic */ }}>
          <label htmlFor="filter-name">Name</label>
          <input id="filter-name" name="filter" />
          <button type="submit">Apply</button>
        </form>
      </nav>

      {editing && (
        <form  style={{ marginTop: 12, borderTop: '1px solid #ddd', paddingTop: 12 }} aria-labelledby="edit-move-heading">
          <h3 id="edit-move-heading">Edit Move</h3>
          <label htmlFor="edit-move-name">Name EN:</label>
          <input id="edit-move-name" value={editing.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
          <label htmlFor="edit-move-dice">Dice Expression:</label>
          <input id="edit-move-dice" value={editing.dice_expression || ''} onChange={(e) => setEditing({ ...editing, dice_expression: e.target.value })} />
          <label htmlFor="edit-move-desc">Description EN:</label>
          <input id="edit-move-desc" value={editing.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
          <button onClick={handleSaveEdit}>Save</button>
          <button style={{ marginLeft: 8 }} onClick={() => setEditing(null)}>Cancel</button>
        </form>
      )}
    </section>
  )
}
