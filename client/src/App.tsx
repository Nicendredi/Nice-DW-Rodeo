import React from 'react'
import CharacterSheet from './pages/CharacterSheet'

export default function App(): JSX.Element {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Nice DW Rodeo — Character Sheets</h1>
      </header>
      <main>
        <CharacterSheet />
      </main>
    </div>
  )
}
