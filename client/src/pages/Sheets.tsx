import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { listSheets, createSheet, deleteSheet, SheetPayload } from '../api/sheets'

type Props = {
  onSelect?: (sheet: any) => void
  onChange?: (createdOrNull: any | null) => void
  reloadToken?: number
}

export default function Sheets({ onSelect, onChange, reloadToken }: Props): JSX.Element {
  const { t } = useTranslation()
  const [sheets, setSheets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await listSheets()
      setSheets(Array.isArray(data) ? data : [])
      try {
        const ures = await fetch('/api/users')
        if (ures.ok) {
          const ujson = await ures.json()
          setUsers(Array.isArray(ujson) ? ujson : [])
        }
      } catch (e) {
        // ignore user load errors
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [reloadToken])

  async function handleCreate() {
    if (!newName.trim()) return
    const payload: SheetPayload = { name: newName.trim(), attributes: {}, moves: [] }
    try {
      const created = await createSheet(payload)
      setNewName('')
      onChange?.(created)
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('confirm_delete_sheet'))) return
    try {
      await deleteSheet(id)
      await load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  return (
    <section>
      <h3>{t('sheets')}</h3>
      <form id="create-sheet" action="#" method="post" onSubmit={(e) => { e.preventDefault(); handleCreate() }} style={{ marginBottom: 12 }}>
        <label htmlFor="new-sheet">{t('new_sheet')}</label>
        <input id="new-sheet" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('new_sheet_name')} />
        <button type="submit" style={{ marginLeft: 8 }}>{t('create')}</button>
      </form>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <h4>{t('available')}</h4>
          <ul>
          {sheets.map((s) => {
            const owner = users.find((u) => u.id === s.owner_id)
            const ownerName = owner ? (owner.name || owner.display_name || owner.id) : (s.owner_id || '—')
            return (
              <li key={s.id}>
                <a href={`#sheet-${s.id}`} data-sheet-id={s.id} onClick={(e) => { e.preventDefault(); onSelect?.(s) }}>{s.name}</a> — <small>{ownerName}</small>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: 8 }}>{t('delete')}</button>
              </li>
            )
          })}
          </ul>
        </>
      )}
    </section>
  )
}
