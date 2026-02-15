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

// Users API (read-only for now)
app.get('/api/users', (_req, res) => {
  const users = readJson('users')
  res.json(users)
})

app.get('/api/users/:id', (req, res) => {
  const users = readJson('users')
  const user = users.find((u: any) => u.id === req.params.id)
  if (!user) return res.status(404).json({ error: 'not found' })
  res.json(user)
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

// Moves API
app.get('/api/moves', (_req, res) => {
  const moves = readJson('moves');
  res.json(moves);
});

app.get('/api/moves/:id', (req, res) => {
  const moves = readJson('moves');
  const move = moves.find((m: any) => m.id === req.params.id);
  if (!move) return res.status(404).json({ error: 'not found' });
  res.json(move);
});

app.post('/api/moves', (req, res) => {
  const moves = readJson('moves')
  const id = (crypto as any).randomUUID()
  const now = new Date().toISOString()
  const move = {
    id,
    name_en: req.body.name_en || req.body.name || 'Untitled',
    name_fr: req.body.name_fr || null,
    description_en: req.body.description_en || req.body.description || null,
    description_fr: req.body.description_fr || null,
    dice_expression: req.body.dice_expression || null,
    created_at: now
  }
  moves.push(move)
  writeJson('moves', moves)
  res.status(201).json(move)
})

app.put('/api/moves/:id', (req, res) => {
  const moves = readJson('moves')
  const idx = moves.findIndex((m: any) => m.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const updated = { ...moves[idx], ...req.body, id: moves[idx].id }
  moves[idx] = updated
  writeJson('moves', moves)
  res.json(updated)
})

app.delete('/api/moves/:id', (req, res) => {
  let moves = readJson('moves')
  const idx = moves.findIndex((m: any) => m.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const removed = moves.splice(idx, 1)
  writeJson('moves', moves)
  res.json(removed[0])
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})
