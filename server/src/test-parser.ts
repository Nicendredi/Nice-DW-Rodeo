import { parseDiceExpression } from './dice'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    // eslint-disable-next-line no-console
    console.error('FAIL:', msg)
    process.exitCode = 2
  } else {
    // eslint-disable-next-line no-console
    console.log('OK:', msg)
  }
}

async function run() {
  // Deterministic seeded roll
  const r1 = parseDiceExpression('2d6+2', 'seed-123')
  const r2 = parseDiceExpression('2d6+2', 'seed-123')
  assert(r1.valid && r2.valid, 'seeded parses valid')
  assert(JSON.stringify(r1.detail) === JSON.stringify(r2.detail), 'seeded rolls are deterministic')

  // Validate total extraction
  assert(typeof r1.total === 'number' && r1.total >= 4 && r1.total <= 14, 'total present and within bounds')

  // Malformed expressions should return invalid
  const bad = parseDiceExpression('999999d1000000')
  assert(bad.valid === false, 'rejects too many dice')

  // Non-dice input should be rejected by parser or produce invalid
  const bad2 = parseDiceExpression('not a dice expr')
  assert(bad2.valid === false, 'rejects malformed expression')

  // All done
  // eslint-disable-next-line no-console
  console.log('Parser tests completed')
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error running parser tests', err)
  process.exitCode = 2
})
