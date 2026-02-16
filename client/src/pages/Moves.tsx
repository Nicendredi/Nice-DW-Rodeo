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

  function renderRollDetail(detail: any) {
    if (!detail) return <div style={{ fontStyle: 'italic' }}>No detail</div>

    // If the detail includes a dice array produced by the parser
    const dice = Array.isArray(detail.dice) ? detail.dice : detail.dice ?? undefined

    // Fallback: if detail is an object with `value` and `rolls` fields, show JSON
    if (!detail.dice && detail.rolls && !Array.isArray(detail.rolls)) {
      return <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(detail, null, 2)}</pre>
    }

    // If `dice` exists and is an array, produce a readable breakdown
    if (Array.isArray(detail.dice)) {
      const parts = detail.dice.map((d: any, idx: number) => {
        if (d.type === 'number' || (d.value !== undefined && d.die === undefined)) {
          return (<span key={idx}>{String(d.value)}</span>)
        }
        // die group
        const count = d.count?.value ?? d.count ?? 1
        const faces = d.die?.value ?? (d.die ?? {}).value ?? ''
        const rolls = Array.isArray(d.rolls) ? d.rolls.map((r: any) => r.roll ?? r.value ?? r).join(', ') : String(d.value ?? '')
        return (
          <span key={idx}>{count}d{faces}: [{rolls}]</span>
        )
      })

      // include ops and total if present
      return (
        <div style={{ fontSize: 13 }}>
          <div style={{ marginBottom: 6 }}>{parts.reduce((acc: any[], cur: any, i: number) => acc.concat(i === 0 ? [cur] : [acc.pop(), ' + ', cur]), [] as any[])}</div>
          {detail.ops && Array.isArray(detail.ops) && (
            <div style={{ color: '#666', fontSize: 12 }}>ops: {detail.ops.join(' ')}</div>
          )}
          <div style={{ marginTop: 6 }}><strong>Computed:</strong> {String(detail.value ?? detail.total ?? '')}</div>
        </div>
      )
    }

    // Default fallback: pretty JSON
    return <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(detail, null, 2)}</pre>
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
                    <summary style={{ background: '#222', color: '#fff', padding: '4px 6px', borderRadius: 4 }}>Last roll</summary>
                    {m.id && lastRolls[m.id] && (
                      <div style={{ marginTop: 8, padding: 8 }}>
                        <div><strong>Result:</strong> {String(lastRolls[m.id].total ?? lastRolls[m.id].value ?? '')}</div>
                        <div style={{ marginTop: 8 }}>
                          {renderRollDetail(lastRolls[m.id].rolls ?? lastRolls[m.id].detail ?? lastRolls[m.id])}
                        </div>
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
