import { chains } from '#/constants'
import { getDatabase } from '#/database'
import type { Chain } from '#/types'

export async function migrate(DB: Env['DB']) {
  const db = await getDatabase(DB)
  for (const chain in chains) {
    await db.schema
      .createTable(chain as Chain)
      .addColumn('address', 'varchar')
      .addColumn('name', 'varchar')
      .addColumn('symbol', 'varchar')
      .addColumn('chainId', 'integer')
      .addColumn('logoURI', 'varchar')
      .addColumn('decimals', 'integer')
      .addPrimaryKeyConstraint('primary_key', ['address'])
      .execute()
  }
}
