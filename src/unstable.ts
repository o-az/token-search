import assert from 'node:assert'
import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import { type UnstableDevWorker, unstable_dev } from 'wrangler'

describe('worker', () => {
  let worker: UnstableDevWorker

  before(async () => {
    worker = await unstable_dev('./src/database/seed_.ts', {
      experimental: {
        // liveReload: true,
        // watch: true,

        d1Databases: [
          {
            binding: 'DB',
            // temp random id
            database_id: '4d98ac85-c841-4970-b8e0-74c40fdba428',
            database_name: 'tokens',
          },
        ],
        disableExperimentalWarning: true,
      },
    })
  })

  it('should return ok', async () => {
    const response = await worker.fetch()
    const text = await response.text()
    console.log(JSON.stringify(text, undefined, 2))
    if (response.status !== 200) throw new Error('bad status')
    console.log(text)
    // assert.strictEqual(text, 'ok')
    // await worker.stop()
  })

  after(async () => {
    await worker.stop()
  })
})
