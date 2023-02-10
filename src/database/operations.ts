import { type SQLQueryBindings } from 'bun:sqlite';
import type { Token } from '@/types';
import { prepend$ToKeys } from '@/utilities';
import { database } from './init';

export const getFirstToken = (): Token[] => database.query(/*sql*/ `SELECT * FROM token`).get();

export const getAllTokens = (): Token[] => database.query(/*sql*/ `SELECT * FROM token`).all();

export const getToken = <T extends keyof Token>({
  by,
  value,
}: {
  by: T;
  value: Token[T];
}): Array<Token> => {
  const query = database.query(/*sql*/ `SELECT * FROM token WHERE ${by} = ?`);
  return query.all(value);
};

// insert new tokens / rows
export const insertNewTokens = (tokens: Array<Token>) => {
  const insert = database.prepare<SQLQueryBindings, Token[]>(
    /*sql*/
    `INSERT INTO token
      (address, name, symbol, decimals, coingeckoId, wallet, stable, native)
      VALUES ($address, $name, $symbol, $decimals, $coingeckoId, $wallet, $stable, $native)`
  );
  const insertMany = database.transaction(tokens => tokens.map(token => insert.run(token)));
  return insertMany(tokens.map(token => prepend$ToKeys(token)));
};
