import { database } from './init'
import type { AlmostAny, Chain, Token } from '@/types'
import { prepend$ToKeys } from '@/utilities'
import type { SQLQueryBindings } from 'bun:sqlite'

import { chains } from '@/constants'

export const getAllTokens = () => {
	const query = Object.keys(chains)
		.map((chain) => /*sql*/ `SELECT * FROM ${chain}`)
		.join('\n UNION \n')
	return database.query<Array<Token>, Array<SQLQueryBindings>>(query).all()
}

export const getFirstToken = (chain: Chain) =>
	database.query<Array<Token>, Array<SQLQueryBindings>>(/*sql*/ `SELECT * FROM ${chain}`).get()

export const getAllChainTokens = (chain: Chain) =>
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
	const query = database.query<Token, Array<SQLQueryBindings>>(
		/*sql*/ `SELECT * FROM ${chain} WHERE ${by} = ?`
	)
	return query.all(value)
}

// insert new tokens / rows
export const insertNewTokens = (chain: Chain, tokens: Array<Token>) => {
	const insert = database.prepare<Array<Token>, SQLQueryBindings>(/*sql*/ `INSERT INTO ${chain}
      (address, name, symbol, chainId, logoURI, decimals)
      VALUES ($address, $name, $symbol, $chainId, $logoURI, $decimals)`)
	const insertMany = database.transaction((tokens) =>
		tokens.map((token: AlmostAny) => insert.run(token))
	)
	return insertMany(tokens.map((token) => prepend$ToKeys(token)))
}
