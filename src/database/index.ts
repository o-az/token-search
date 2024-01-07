export * from './operations'
import type { Chain, Pretty, Token } from '#/types'

import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

interface KvTable {
  key: string
  value: string
}

export type Database = {
  [K in Chain]: Pretty<Token>
}

type GetDatabase = (database: Env['DB']) => Promise<Kysely<Database>>

export const getDatabase: GetDatabase = async database =>
  new Kysely<Database>({
    // @ts-expect-error
    dialect: new D1Dialect({ database })
  })
