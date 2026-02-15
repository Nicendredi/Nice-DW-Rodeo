import React, { useState } from 'react'
import Sheets from './pages/Sheets'
import CharacterSheet, { Sheet } from './pages/CharacterSheet'
import { createSheet, updateSheet, deleteSheet as apiDelete } from './api/sheets'
import Moves from './pages/Moves'

export default function App(): JSX.Element {
  const [selected, setSelected] = useState<Sheet | undefined>(undefined)
  const [sheetsReload, setSheetsReload] = useState(0)

  async function handleSave(s: Sheet) {
    try {
      if (s.id) {
        const updated = await updateSheet(s.id, s)
        setSelected(updated)
        setSheetsReload((v) => v + 1)
        alert('Updated')
      } else {
        const created = await createSheet(s)
        setSelected(created)
        setSheetsReload((v) => v + 1)
        alert('Created')
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Save failed')
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiDelete(id)
      if (selected?.id === id) setSelected(undefined)
      setSheetsReload((v) => v + 1)
      alert('Deleted')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Nice DW Rodeo — Character Sheets</h1>
      </header>
      <main style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: '0 0 33%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
            <Sheets onSelect={(s) => setSelected(s)} onChange={(c) => setSelected(c ?? undefined)} reloadToken={sheetsReload} />
          </div>
          <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
            <Moves />
          </div>
        </div>
        <aside style={{ flex: 1 }}>
          <CharacterSheet sheet={selected} onSave={handleSave} onDelete={handleDelete} />
        </aside>
      </main>
    </div>
  )
}
