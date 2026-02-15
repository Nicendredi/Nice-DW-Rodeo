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
    <>
      <header className="site" role="banner">
        <div />
        <nav className="primary" aria-label="Main navigation">
          <a href="#sheets">Sheets</a>
          <a href="#moves">Moves</a>
          <a href="#settings">Settings</a>
        </nav>
      </header>

      <section className="layout" role="application">
        <nav className="secondary" aria-label="Sheets navigation">
          <h3>Sheets</h3>
          <Sheets onSelect={(s) => setSelected(s)} onChange={(c) => setSelected(c ?? undefined)} reloadToken={sheetsReload} />
        </nav>

        <main id="main" role="main" aria-labelledby="sheet-title">
          <article aria-labelledby="sheet-title">
            <CharacterSheet sheet={selected} onSave={handleSave} onDelete={handleDelete} />
          </article>
        </main>

        <aside className="compendium" aria-label="Move compendium">
          <h3>Compendium</h3>
          <Moves />
        </aside>
      </section>

      <output id="toasts" aria-live="polite" aria-atomic="true"></output>

      <footer className="site-footer" role="contentinfo">
        <p>Nice Dungeon World — Example layout · 2026</p>
      </footer>
    </>
  )
}
