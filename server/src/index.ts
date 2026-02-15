import express from 'express'
import cors from 'cors'
import { readJson, writeJson } from './db/jsonStore'
import crypto from 'crypto'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/sheets', (_req, res) => {
  const sheets = readJson('character_sheets')
  res.json(sheets)
})

app.get('/api/sheets/:id', (req, res) => {
  const sheets = readJson('character_sheets')
  const sheet = sheets.find((s: any) => s.id === req.params.id)
  if (!sheet) return res.status(404).json({ error: 'not found' })
  res.json(sheet)
})

app.post('/api/sheets', (req, res) => {
  const sheets = readJson('character_sheets')
  const id = (crypto as any).randomUUID()
  const now = new Date().toISOString()
  const sheet = {
    id,
    owner_id: req.body.owner_id || null,
    campaign_id: req.body.campaign_id || null,
    name: req.body.name || 'Untitled',
    attributes: req.body.attributes || {},
    moves: req.body.moves || [],
    created_at: now
  }
  sheets.push(sheet)
  writeJson('character_sheets', sheets)
  res.status(201).json(sheet)
})

app.put('/api/sheets/:id', (req, res) => {
  const sheets = readJson('character_sheets')
  const idx = sheets.findIndex((s: any) => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const updated = { ...sheets[idx], ...req.body }
  sheets[idx] = updated
  writeJson('character_sheets', sheets)
  res.json(updated)
})

app.delete('/api/sheets/:id', (req, res) => {
  let sheets = readJson('character_sheets')
  const idx = sheets.findIndex((s: any) => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const removed = sheets.splice(idx, 1)
  writeJson('character_sheets', sheets)
  res.json(removed[0])
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})
