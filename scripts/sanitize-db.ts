import { getDatabase } from '#/database'
import { removeRows } from '#/database'
import { hasBalanceOfBatch } from '#/erc20-methods'
import type { Chain } from '#/types'
import { arrayToChunks, isChain, sleep } from '#/utilities'
import { sql } from 'kysely'

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url)
    const [_, pathParam] = pathname.split('/')
    if (pathParam === 'clean') {
      const { chain, addresses } = (await request.json()) as { chain: Chain; addresses: string[] }
      const deleteRows = await removeRows({ database: env.DB, chain, addresses })
      console.log(JSON.stringify(deleteRows, undefined, 2))

      const db = await getDatabase(env.DB)
      const rows = await sql /*sql*/`DROP TABLE ${chain} IF EXISTS`.execute(db)
      console.log(rows)
      return new Response(JSON.stringify(deleteRows, undefined, 2))
    }
    if (!isChain(pathParam)) return new Response('invalid chain', { status: 400 })
    const database = await getDatabase(env.DB)
    const result = await database.selectFrom(pathParam).selectAll().execute()
    const chunks = arrayToChunks(result, 100)
    const results = []
    const errors = []
    for (const chunk of chunks) {
      const addresses = chunk.map((row) => row.address)
      try {
        const hasBalanceOfs = await hasBalanceOfBatch(pathParam as Chain, addresses, env)

        hasBalanceOfs.map((hasBalanceOf, index) => {
          if (hasBalanceOf) {
            results.push(chunk[index].address)
          } else {
            errors.push(chunk[index].address)
          }
        })
      } catch (error) {
        console.error(error)
        errors.push(...chunk.map((_) => _.address))
      } finally {
        sleep(5)
      }
    }

    console.log(JSON.stringify({ errors }, undefined, 2))

    const errorChunks = arrayToChunks(errors, 100)
    for (const chunk of errorChunks) {
      try {
        const deleteRows = await removeRows({
          database: env.DB,
          chain: pathParam,
          addresses: chunk,
        })
        console.log(JSON.stringify(deleteRows, undefined, 2))
      } catch (error) {
        console.error(error)
      }
    }

    return new Response(
      JSON.stringify({
        errors,
        results,
      }),
      {
        headers: { 'content-type': 'application/json' },
      }
    )
  },
}
