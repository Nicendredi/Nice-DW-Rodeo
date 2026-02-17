import express from 'express'
import cors from 'cors'
import { readJson, writeJson } from './db/jsonStore'
import crypto from 'crypto'
import http from 'http'
import { Server as IOServer } from 'socket.io'
import { parseDiceExpression, createRollRecord, verifyAndRecord } from './dice'

const app = express()
app.use(cors())
app.use(express.json())

// create HTTP server and attach Socket.IO
const httpServer = http.createServer(app)
const io = new IOServer(httpServer, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('socket connected', socket.id)
  socket.on('join', (room) => {
    socket.join(room)
  })
})

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
  const lang = String((_req.query && _req.query.lang) || (_req.headers['accept-language'] || '')).split(',')[0].slice(0,2)
  if (!lang || lang === 'en') return res.json(moves)
  // map localized fields
  const localized = moves.map((m: any) => {
    const name = m.name_fr || m.name_en
    const description = m.description_fr || m.description_en
    const translation_missing = !m.name_fr || !m.description_fr
    return { ...m, name, description, translation_missing }
  })
  res.json(localized)
});

app.get('/api/moves/:id', (req, res) => {
  const moves = readJson('moves');
  const move = moves.find((m: any) => m.id === req.params.id);
  if (!move) return res.status(404).json({ error: 'not found' });
  const lang = String((req.query && req.query.lang) || (req.headers['accept-language'] || '')).split(',')[0].slice(0,2)
  if (!lang || lang === 'en') return res.json(move)
  const name = move.name_fr || move.name_en
  const description = move.description_fr || move.description_en
  const translation_missing = !move.name_fr || !move.description_fr
  res.json({ ...move, name, description, translation_missing })
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

// Roll endpoints
app.post('/api/moves/:id/roll', (req, res) => {
  const moves = readJson('moves')
  const move = moves.find((m: any) => m.id === req.params.id)
  const expression = (req.body && req.body.expression) || (move && (move.dice_expression || move.dice))
  if (!expression) return res.status(400).json({ error: 'no dice expression' })
  const seed = req.body && req.body.seed
  const clientTotal = req.body && (req.body.client_total ?? req.body.clientTotal)
  const clientDetail = req.body && (req.body.client_detail ?? req.body.clientDetail)

  if (clientTotal !== undefined) {
    // verify client-provided result by replaying using seed
    const out = verifyAndRecord(req.params.id, String(expression), seed, clientTotal, clientDetail)
    // broadcast verification and move executed to subscribers
    io.emit('move:executed', { move_id: req.params.id, verification: out.verification, record: out.record })
    return res.json({ verification: out.verification, record: out.record })
  }

  const parsed = parseDiceExpression(String(expression), seed)
  if (!parsed.valid) return res.status(400).json({ error: parsed.error })

  const rollRecord = createRollRecord(req.params.id, String(expression), parsed.detail ?? null, parsed.total)
  io.emit('move:executed', { move_id: req.params.id, record: rollRecord })
  res.json(rollRecord)
})

app.post('/api/roll', (req, res) => {
  const expression = req.body && req.body.expression
  if (!expression) return res.status(400).json({ error: 'no dice expression' })
  const seed = req.body && req.body.seed
  const clientTotal = req.body && (req.body.client_total ?? req.body.clientTotal)
  const clientDetail = req.body && (req.body.client_detail ?? req.body.clientDetail)

  if (clientTotal !== undefined) {
    const out = verifyAndRecord(null, String(expression), seed, clientTotal, clientDetail)
    io.emit('move:executed', { move_id: null, verification: out.verification, record: out.record })
    return res.json({ verification: out.verification, record: out.record })
  }

  const parsed = parseDiceExpression(String(expression), seed)
  if (!parsed.valid) return res.status(400).json({ error: parsed.error })
  const rollRecord = createRollRecord(null, String(expression), parsed.detail ?? null, parsed.total)
  io.emit('move:executed', { move_id: null, record: rollRecord })
  res.json(rollRecord)
})

// parseDiceExpression and createRollRecord are provided by ./dice

const port = process.env.PORT ? Number(process.env.PORT) : 4000
httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})
