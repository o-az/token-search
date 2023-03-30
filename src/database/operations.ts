import { type SQLQueryBindings } from 'bun:sqlite'
import type { Chain, Token } from '@/types'
import { prepend$ToKeys } from '@/utilities'
import { database } from './init'

export const getFirstToken = (chain: Chain) =>
  database.query<Array<Token>, Array<SQLQueryBindings>>(/*sql*/ `SELECT * FROM ${chain}`).get()

export const getAllTokens = (chain: Chain) =>
  database.query<Array<Token>, Array<SQLQueryBindings>>(/*sql*/ `SELECT * FROM ${chain}`).all()

export const getToken = <T extends keyof Token>(
  chain: Chain,
  {
    by,
    value,
  }: {
    by: T
    value: Token[T]
  }
): Array<Token> => {
  const query = database.query<Token, Array<SQLQueryBindings>>(/*sql*/ `SELECT * FROM ${chain} WHERE ${by} = ?`)
  return query.all(value)
}

// insert new tokens / rows
export const insertNewTokens = (chain: Chain, tokens: Array<Token>) => {
  const insert = database.prepare<Array<Token>, SQLQueryBindings>(
    /*sql*/
    `INSERT INTO ${chain}
      (address, name, symbol, decimals, coingeckoId, wallet, stable, native)
      VALUES ($address, $name, $symbol, $decimals, $coingeckoId, $wallet, $stable, $native)`
  )
  const insertMany = database.transaction(tokens => tokens.map(token => insert.run(token)))
  return insertMany(tokens.map(token => prepend$ToKeys(token)))
}
