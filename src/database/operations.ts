import { chains } from '#/constants'
import { type Database, getDatabase } from '#/database'
import type { Chain, Token } from '#/types'
import { arrayToChunks } from '#/utilities'
import type { OperandValueExpressionOrList, ReferenceExpression } from 'kysely'

export async function getAllTokens(database: D1Database) {
  const db = await getDatabase(database)
  const chainNames = Object.keys(chains) as Array<Chain>
  const tokens = await Promise.all(
    chainNames.map(async (chain) => await db.selectFrom(chain).selectAll(chain).execute())
  )
  return tokens
}

export async function getFirstToken({
  database,
  chain,
}: {
  chain: Chain
  database: D1Database
}) {
  const db = await getDatabase(database)
  return await db.selectFrom(chain).limit(1).executeTakeFirst()
}

export async function getAllChainTokens({
  database,
  chain,
}: {
  chain: Chain
  database: D1Database
}) {
  const db = await getDatabase(database)
  const results = await db.selectFrom(chain).selectAll().execute()
  return results
}

export async function getToken<T extends keyof Token>({
  database,
  chain,
  by,
  value,
}: {
  chain: Chain
  database: D1Database
  by: ReferenceExpression<Database, Chain>
  value: OperandValueExpressionOrList<Database, Chain, T>
}): Promise<Array<Token>> {
  const db = await getDatabase(database)
  return await db.selectFrom(chain).selectAll().where(by, '==', value).execute()
}

export async function clearTable({ database, chain }: { chain: Chain; database: D1Database }) {
  const db = await getDatabase(database)
  return await db.deleteFrom(chain).execute()
}

export async function insertNewTokens({
  database,
  chain,
  tokens,
}: {
  chain: Chain
  tokens: Array<Token>
  database: D1Database
}) {
  try {
    const db = await getDatabase(database)
    /**
     * @cloudflare D1 SQLite limit is 100_000 bytes (100KB)
     * @SQLite insert limit is 500 rows
     */
    const chunksSize = 80
    const chunks = arrayToChunks(tokens, chunksSize)
    for await (const chunk of chunks) {
      await db
        .insertInto(chain)
        .values(chunk)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }

    return 'success'
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : `Encoutered an error: ${error}`
    console.trace(errorMessage)
    return 'failed'
  }
}
