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
    setDraft((d) => ({ ...d, moves: [...(d.moves || []), newMove.trim()] }))
    setNewMove('')
  }

  function removeMove(idx: number) {
    setDraft((d) => {
      const m = [...(d.moves || [])]
      m.splice(idx, 1)
      return { ...d, moves: m }
    })
  }

  function update<K extends keyof Sheet>(k: K, v: Sheet[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
  }

  return (
    <section>
      <h2>{sheet ? 'Edit Sheet' : 'New Sheet'}</h2>

      {draft.created_at && (
        <div style={{ marginBottom: 8 }}><small>Created: {draft.created_at}</small></div>
      )}

      <label>
        Name: <input value={draft.name} onChange={(e) => update('name', e.target.value)} />
      </label>

      <div style={{ marginTop: 8 }}>
        <label>
          Owner ID: <input value={draft.owner_id ?? ''} onChange={(e) => update('owner_id', e.target.value || null)} />
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          Campaign ID: <input value={draft.campaign_id ?? ''} onChange={(e) => update('campaign_id', e.target.value || null)} />
        </label>
      </div>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Attributes</legend>
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
      </fieldset>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Moves</legend>
        {(draft.moves && draft.moves.length > 0) ? (
          <ul>
            {draft.moves.map((m, i) => (
              <li key={`${(m as any)?.id ?? m}-${i}`}>
                <strong>{typeof m === 'string' ? m : (m as any).name}</strong>
                <button style={{ marginLeft: 8 }} onClick={() => removeMove(i)}>Remove</button>
              </li>
            ))}
          </ul>
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
      </fieldset>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => onSave && onSave(draft)}>Save</button>
        {sheet?.id && onDelete && (
          <button style={{ marginLeft: 8 }} onClick={() => onDelete(sheet.id!)}>Delete</button>
        )}
      </div>
    </section>
  )

  return (
    <section>
      <h2>{sheet ? 'Edit Sheet' : 'New Sheet'}</h2>

      {draft.created_at && (
        <div style={{ marginBottom: 8 }}><small>Created: {draft.created_at}</small></div>
      )}

      <label>
        Name: <input value={draft.name} onChange={(e) => update('name', e.target.value)} />
      </label>

      <div style={{ marginTop: 8 }}>
        <label>
          Owner ID: <input value={draft.owner_id ?? ''} onChange={(e) => update('owner_id', e.target.value || null)} />
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          Campaign ID: <input value={draft.campaign_id ?? ''} onChange={(e) => update('campaign_id', e.target.value || null)} />
        </label>
      </div>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Attributes</legend>
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
      </fieldset>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Moves</legend>
        {(draft.moves && draft.moves.length > 0) ? (
          <ul>
            {draft.moves.map((m, i) => (
              <li key={`${m?.id ?? m}-${i}`}>
                <strong>{typeof m === 'string' ? m : m.name}</strong>
                <button style={{ marginLeft: 8 }} onClick={() => removeMove(i)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No moves yet</p>
        )}
        <div style={{ marginTop: 8 }}>
          <input placeholder="move text" value={newMove} onChange={(e) => setNewMove(e.target.value)} />
          <button style={{ marginLeft: 8 }} onClick={() => {
            // add local-only move object
            if (!newMove.trim()) return
            setDraft((d) => ({ ...d, moves: [...(Array.isArray(d.moves) ? d.moves : []), { name: newMove.trim() }] }))
            setNewMove('')
          }}>Add Local Move</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <MoveInserter onInsert={(mv) => setDraft((d) => ({ ...d, moves: [...(Array.isArray(d.moves) ? d.moves : []), mv] }))} />
        </div>
      </fieldset>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => onSave && onSave(draft)}>Save</button>
        {sheet?.id && onDelete && (
          <button style={{ marginLeft: 8 }} onClick={() => onDelete(sheet.id!)}>Delete</button>
        )}
      </div>
    </section>
  )
}
