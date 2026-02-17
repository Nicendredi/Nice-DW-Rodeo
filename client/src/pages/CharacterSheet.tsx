import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [draft, setDraft] = useState<Sheet>(sheet || { name: '', attributes: {}, moves: [] })
  const [newAttrKey, setNewAttrKey] = useState('')
  const [newAttrVal, setNewAttrVal] = useState<string | number>('')
  const [newMove, setNewMove] = useState('')
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())
  const [lastRolls, setLastRolls] = useState<Record<string, any>>({})

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

  function flattenRolls(rolls: any): Array<number | string> {
    if (!rolls) return []
    if (Array.isArray(rolls)) return rolls
    const out: Array<number | string> = []
    // handle parser object with `dice` groups
    if (rolls.dice && Array.isArray(rolls.dice)) {
      for (const grp of rolls.dice) {
        if (grp.rolls && Array.isArray(grp.rolls)) {
          for (const r of grp.rolls) {
            if (r.roll !== undefined) out.push(r.roll)
            else if (r.value !== undefined) out.push(r.value)
          }
        } else if (grp.value !== undefined) {
          out.push(grp.value)
        }
      }
    } else if (rolls.value !== undefined) {
      out.push(rolls.value)
    }
    return out
  }

  async function handleRollMove(mv: any, idx?: number) {
    try {
      let result
      if (mv.id) {
        // prefer server-side roll for stored moves
        const mod = (mv.dice_expression || mv.dice || '')
        result = await (await import('../api/moves')).rollMove(mv.id, mod)
      } else if (mv.dice_expression) {
        result = await (await import('../api/moves')).rollExpression(mv.dice_expression)
      } else {
        alert('No dice expression')
        return
      }
      // store for UI rendering
      const key = mv.id ?? `local-${idx ?? Math.random().toString(36).slice(2)}`
      setLastRolls((p) => ({ ...p, [key]: result }))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Roll failed')
    }
  }

  function renderRollDetail(detail: any) {
    if (!detail) return <div style={{ fontStyle: 'italic' }}>No detail</div>

    if (detail.dice && Array.isArray(detail.dice)) {
      const parts = detail.dice.map((d: any, idx: number) => {
        if (d.type === 'number' || (d.value !== undefined && d.die === undefined)) {
          return (<span key={idx}>{String(d.value)}</span>)
        }
        const count = d.count?.value ?? d.count ?? 1
        const faces = d.die?.value ?? (d.die ?? {}).value ?? ''
        const rolls = Array.isArray(d.rolls) ? d.rolls.map((r: any) => r.roll ?? r.value ?? r).join(', ') : String(d.value ?? '')
        return (
          <div key={idx}>{count}d{faces}: [{rolls}]</div>
        )
      })
      return (
        <div style={{ fontSize: 13 }}>
          <div>{parts}</div>
          {detail.ops && Array.isArray(detail.ops) && (
            <div style={{ color: '#666', fontSize: 12 }}>ops: {detail.ops.join(' ')}</div>
          )}
          <div style={{ marginTop: 6 }}><strong>Computed:</strong> {String(detail.value ?? detail.total ?? '')}</div>
        </div>
      )
    }

    if (detail.rolls && !Array.isArray(detail.rolls)) {
      return <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(detail, null, 2)}</pre>
    }

    return <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(detail, null, 2)}</pre>
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
          <input aria-label={t('character_name')} value={draft.name} onChange={(e) => update('name', e.target.value)} style={{ fontSize: '1.25rem', width: '100%' }} />
        </h1>
        <section className="meta" aria-label={t('sheet_metadata')} style={{ marginTop: 8 }}>
          {draft.created_at && <div><small>{t('created')}: {draft.created_at}</small></div>}
          <dl style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <dt>Owner</dt>
            <dd><input value={draft.owner_id ?? ''} onChange={(e) => update('owner_id', e.target.value || null)} /></dd>
            <dt>Campaign</dt>
            <dd><input value={draft.campaign_id ?? ''} onChange={(e) => update('campaign_id', e.target.value || null)} /></dd>
          </dl>
        </section>
      </header>

      <section aria-labelledby="attributes" className="card" style={{ marginTop: 12 }}>
        <h2 id="attributes">{t('attributes')}</h2>
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
          <p>{t('no_attributes')}</p>
        )}
        <div style={{ marginTop: 8 }}>
          <input placeholder={t('attr_key')} value={newAttrKey} onChange={(e) => setNewAttrKey(e.target.value)} />
          <input placeholder={t('attr_value')} style={{ width: 80, marginLeft: 8 }} value={String(newAttrVal)} onChange={(e) => setNewAttrVal(e.target.value)} />
          <button style={{ marginLeft: 8 }} onClick={addAttribute}>{t('add')}</button>
        </div>
      </section>

      <section aria-labelledby="moves" className="card" style={{ marginTop: 12 }}>
        <h2 id="moves">{t('moves')}</h2>
        {(draft.moves && Array.isArray(draft.moves) && draft.moves.length > 0) ? (
          <>
            {draft.moves.map((m, i) => {
              const mv: any = typeof m === 'string' ? { name: m } : m
              const isOpen = openIndices.has(i)
              return (
                <details key={`${mv.id ?? mv.name}-${i}`} open={isOpen} onToggle={() => toggleOpen(i)}>
                  <summary>
                    <strong>{mv.name}</strong>
                    <div>
                      <button style={{ marginLeft: 8 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRollMove(mv, i) }}>Roll</button>
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
                    { (mv.id || true) && (
                      <div style={{ marginTop: 8 }}>
                        { lastRolls[mv.id ?? `local-${i}`] && (
                          <div style={{ borderTop: '1px solid #eee', paddingTop: 8 }}>
                            <div><strong>Result:</strong> {String(lastRolls[mv.id ?? `local-${i}`].total ?? lastRolls[mv.id ?? `local-${i}`].value ?? '')}</div>
                            <div style={{ marginTop: 6 }}>{renderRollDetail(lastRolls[mv.id ?? `local-${i}`].rolls ?? lastRolls[mv.id ?? `local-${i}`].detail ?? lastRolls[mv.id ?? `local-${i}`])}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </details>
              )
            })}
          </>
        ) : (
          <p>{t('no_moves')}</p>
        )}
        <aside style={{ marginTop: 8 }}>
          <input placeholder={t('move_text')} value={newMove} onChange={(e) => setNewMove(e.target.value)} />
          <button style={{ marginLeft: 8 }} onClick={addMove}>{t('add_move')}</button>
          <MoveInserter onInsert={(mv: any) => setDraft((d) => ({ ...d, moves: [...(Array.isArray(d.moves) ? d.moves : []), mv] }))} />
        </aside>
      </section>

      <footer style={{ marginTop: 8 }}>
        <button onClick={() => onSave && onSave(draft)}>{t('save')}</button>
        {sheet?.id && onDelete && (
          <button style={{ marginLeft: 8 }} onClick={() => onDelete(sheet.id!)}>{t('delete')}</button>
        )}
      </footer>
    </article>
  )
}
