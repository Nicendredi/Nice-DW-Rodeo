import { verifyAndRecord } from './dice'

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
  // Known seed determinism
  const expr = '2d6+2'
  const seed = 'verify-seed-1'
  const parsed = verifyAndRecord(null, expr, seed, null, null)
  assert(parsed && parsed.record, 'record created')

  // Now simulate client claim matching server
  const parsed2 = verifyAndRecord(null, expr, seed, parsed.verification.server_total, parsed.verification.server_detail)
  assert(parsed2.verification.verified === true, 'verification succeeds for matching client total')

  // Simulate tampered client total
  const parsed3 = verifyAndRecord(null, expr, seed, (parsed.verification.server_total ?? 0) + 1, parsed.verification.server_detail)
  assert(parsed3.verification.verified === false, 'verification fails for mismatched client total')

  // Done
  // eslint-disable-next-line no-console
  console.log('Verify tests completed')
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error running verify tests', err)
  process.exitCode = 2
})
