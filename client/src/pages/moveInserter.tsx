import React, { useEffect, useState } from 'react'
import { listMoves } from '../api/moves'

type Props = { onInsert: (move: any) => void }

export default function MoveInserter({ onInsert }: Props) {
  const [moves, setMoves] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    listMoves().then((m) => { if (mounted) setMoves(m) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  function handleInsert() {
    if (!selected) return
    const mv = moves.find((x) => x.id === selected)
    if (!mv) return
    // insert a local copy, include dice expression and description
    onInsert({ id: mv.id, name: mv.name_en || mv.name || 'Move', description: mv.description_en || mv.description || '', dice_expression: mv.dice_expression || '' })
    setOpen(false)
    setSelected(null)
  }

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}>Insert Stored Move</button>
      {open && (
        <section role="dialog" aria-label="Insert stored move" style={{ border: '1px solid #ddd', padding: 8, marginTop: 8 }}>
          <select value={selected ?? ''} onChange={(e) => setSelected(e.target.value || null)}>
            <option value="">-- select move --</option>
            {moves.map((m) => <option key={m.id} value={m.id}>{m.name_en || m.name || m.id}</option>)}
          </select>
          <button style={{ marginLeft: 8 }} onClick={handleInsert}>Insert</button>
        </section>
      )}
    </div>
  )
}
