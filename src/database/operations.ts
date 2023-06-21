import type { Chain, Token } from '@/types'

import { chains } from '@/constants'
import { arrayToChunks, stringSize } from '@/utilities'
import { Buffer } from 'node:buffer'

export const getAllTokens = async (database: D1Database) => {
  const query = Object.keys(chains)
    .map((chain) => /*sql*/ `SELECT * FROM ${chain}`)
    .join('\n UNION \n')
  return (await database.prepare(query).all()).results as unknown as Array<Token>
}

export const getFirstToken = async ({
  database,
  chain,
}: {
  chain: Chain
  database: D1Database
}) => (await database.prepare(/*sql*/ `SELECT * FROM ${chain}`).first()) as unknown as Token

export const getAllChainTokens = async ({
  database,
  chain,
}: {
  chain: Chain
  database: D1Database
}) =>
  (await database.prepare(/*sql*/ `SELECT * FROM ${chain}`).all())
    .results as unknown as Array<Token>

export const getToken = async <T extends keyof Token>({
  database,
  chain,
  by,
  value,
}: {
  chain: Chain
  database: D1Database
  by: T
  value: Token[T]
}): Promise<Array<Token>> => {
  const query = database.prepare(/*sql*/ `SELECT * FROM ${chain} WHERE ${by} = ?`).bind(value)
  const results = await query.first()
  return results as unknown as Array<Token>
}

export const insertNewTokens = async ({
  database,
  chain,
  tokens,
}: {
  chain: Chain
  tokens: Array<Token>
  database: D1Database
}) => {
  const chunks = arrayToChunks(tokens, 600) // Assuming arrayToChunks is a function that splits the array into chunks
  for (const chunk of chunks) {
    const queriesValues = chunk.map(
      ({ address, name, symbol, chainId, decimals, logoURI }) =>
        `('${address}', '${name}', '${symbol}', ${chainId}, ${decimals}, '${logoURI}')`
    )

    let query = `INSERT OR REPLACE INTO ${chain} (address, name, symbol, chainId, decimals, logoURI) VALUES `
    const joinedValues = queriesValues.join(', ')
    if (stringSize(query + joinedValues) < 100_000) {
      // Check if the query size is less than 100KB
      query += joinedValues
    } else {
      // TODO
    }
    query += ';'

    const result = await database.prepare(query).run()
  }
  return ''
}

// export const insertNewTokens = async ({
//   database,
//   chain,
//   tokens,
// }: {
//   chain: Chain
//   tokens: Array<Token>
//   database: D1Database
// }) => {
//   const queriesValues = tokens.map(
//     ({ address, name, symbol, chainId, decimals, logoURI }) =>
//       `('${address}', '${name}', '${symbol}', ${chainId}, ${decimals}, '${logoURI}')`
//   )

//   const chunks = arrayToChunks(queriesValues, 600)
//   for (const chunk of chunks) {
//     console.log(chunks.length, chunk.join(', '))
//     const query = await database
//       .prepare(/*sql*/ `INSERT OR REPLACE INTO ${chain} VALUES ${chunk.join(', ')};`)
//       .run()
//     // console.log(JSON.stringify(query, undefined, 2))
//   }

//   return ''
// }

// check if table exists
export const tableExists = async (database: D1Database) => {
  try {
    const query = database.prepare(/*sql*/ `SELECT * FROM ethereum`)
    const { results } = await query.all()
    return results.length > 0
  } catch {
    return false
  }
}
