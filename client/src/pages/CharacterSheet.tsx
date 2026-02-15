import React, { useState, useEffect } from 'react'
import MoveInserter from './moveInserter'

export type Sheet = {
  id?: string
  name: string
  owner_id?: string | null
  campaign_id?: string | null
  attributes?: Record<string, number>
  moves?: Array<{
    id?: string
    name?: string
    description?: string
    dice_expression?: string
  }> | string[]
  created_at?: string
}

type Props = {
  sheet?: Sheet
  onSave?: (s: Sheet) => Promise<void> | void
  onDelete?: (id: string) => Promise<void> | void
}

export default function CharacterSheet({ sheet, onSave, onDelete }: Props): JSX.Element {
  const [draft, setDraft] = useState<Sheet>(sheet || { name: '', attributes: {}, moves: [] })
  const [newAttrKey, setNewAttrKey] = useState('')
  const [newAttrVal, setNewAttrVal] = useState<string | number>('')
  const [newMove, setNewMove] = useState('')
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    setDraft(sheet || { name: '', attributes: {}, moves: [] })
  }, [sheet])

  function setAttribute(key: string, value: number) {
    setDraft((d) => ({ ...d, attributes: { ...(d.attributes || {}), [key]: value } }))
  }

  function removeAttribute(key: string) {
    setDraft((d) => {
      const attrs = { ...(d.attributes || {}) }
      delete attrs[key]
      return { ...d, attributes: attrs }
    })
  }

  function addAttribute() {
    if (!newAttrKey.trim()) return
    const val = Number(newAttrVal) || 0
    setAttribute(newAttrKey.trim(), val)
    setNewAttrKey('')
    setNewAttrVal('')
  }

  function addMove() {
    if (!newMove.trim()) return
    setDraft((d) => ({ ...d, moves: [...(Array.isArray(d.moves) ? d.moves : []), newMove.trim()] }))
    setNewMove('')
  }

  function removeMove(idx: number) {
    setDraft((d) => {
      const m = [...(Array.isArray(d.moves) ? d.moves : [])]
      m.splice(idx, 1)
      return { ...d, moves: m }
    })
  }

  function toggleOpen(idx: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  function updateMoveField(idx: number, field: 'description' | 'dice_expression' | 'name', value: string) {
    setDraft((d) => {
      const movesArr = Array.isArray(d.moves) ? [...d.moves] : []
      const cur = movesArr[idx]
      const obj = typeof cur === 'string' ? { name: cur } : { ...(cur as any) }
      ;(obj as any)[field] = value
      movesArr[idx] = obj
      return { ...d, moves: movesArr }
    })
  }

  function update<K extends keyof Sheet>(k: K, v: Sheet[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
  }

  return (
    <article aria-labelledby="sheet-title">
      <header>
        <h1 id="sheet-title">
          <input aria-label="Character name" value={draft.name} onChange={(e) => update('name', e.target.value)} style={{ fontSize: '1.25rem', width: '100%' }} />
        </h1>
        <section className="meta" aria-label="sheet metadata" style={{ marginTop: 8 }}>
          {draft.created_at && <div><small>Created: {draft.created_at}</small></div>}
          <dl style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <dt>Owner</dt>
            <dd><input value={draft.owner_id ?? ''} onChange={(e) => update('owner_id', e.target.value || null)} /></dd>
            <dt>Campaign</dt>
            <dd><input value={draft.campaign_id ?? ''} onChange={(e) => update('campaign_id', e.target.value || null)} /></dd>
          </dl>
        </section>
      </header>

      <section aria-labelledby="attributes" className="card" style={{ marginTop: 12 }}>
        <h2 id="attributes">Attributes</h2>
        {(draft.attributes && Object.keys(draft.attributes).length > 0) ? (
          <ul>
            {Object.entries(draft.attributes).map(([k, v]) => (
              <li key={k}>
                <strong>{k}</strong>: <input type="number" value={String(v)} onChange={(e) => setAttribute(k, Number(e.target.value) || 0)} />
                <button style={{ marginLeft: 8 }} onClick={() => removeAttribute(k)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attributes yet</p>
        )}
        <div style={{ marginTop: 8 }}>
          <input placeholder="key" value={newAttrKey} onChange={(e) => setNewAttrKey(e.target.value)} />
          <input placeholder="value" style={{ width: 80, marginLeft: 8 }} value={String(newAttrVal)} onChange={(e) => setNewAttrVal(e.target.value)} />
          <button style={{ marginLeft: 8 }} onClick={addAttribute}>Add</button>
        </div>
      </section>

      <section aria-labelledby="moves" className="card" style={{ marginTop: 12 }}>
        <h2 id="moves">Moves</h2>
        {(draft.moves && Array.isArray(draft.moves) && draft.moves.length > 0) ? (
          <div>
            {draft.moves.map((m, i) => {
              const mv: any = typeof m === 'string' ? { name: m } : m
              const isOpen = openIndices.has(i)
              return (
                <details key={`${mv.id ?? mv.name}-${i}`} open={isOpen} onToggle={() => toggleOpen(i)}>
                  <summary>
                    <strong>{mv.name}</strong>
                    <div>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeMove(i) }}>Delete</button>
                    </div>
                  </summary>
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ display: 'block' }}>Description:</label>
                      <textarea value={mv.description || ''} onChange={(e) => updateMoveField(i, 'description', e.target.value)} rows={3} style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label>Dice Expression: <input value={mv.dice_expression || ''} onChange={(e) => updateMoveField(i, 'dice_expression', e.target.value)} /></label>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        ) : (
          <p>No moves yet</p>
        )}
        <div style={{ marginTop: 8 }}>
          <input placeholder="move text" value={newMove} onChange={(e) => setNewMove(e.target.value)} />
          <button style={{ marginLeft: 8 }} onClick={addMove}>Add Local Move</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <MoveInserter onInsert={(mv: any) => setDraft((d) => ({ ...d, moves: [...(Array.isArray(d.moves) ? d.moves : []), mv] }))} />
        </div>
      </section>

      <footer style={{ marginTop: 8 }}>
        <button onClick={() => onSave && onSave(draft)}>Save</button>
        {sheet?.id && onDelete && (
          <button style={{ marginLeft: 8 }} onClick={() => onDelete(sheet.id!)}>Delete</button>
        )}
      </footer>
    </article>
  )
}
