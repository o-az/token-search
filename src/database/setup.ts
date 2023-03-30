#!/usr/bin/env bun

/**
 * This is intended to be run as a script, not imported. It runs with the `bun setup` command.
 */

import { chains } from '@/constants'
import type { Chain } from '@/types'
import { database } from '@/database'

const createTableQuery = (chain: Chain) => /*sql*/ `CREATE TABLE ${chain} (
    address TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    symbol TEXT,
    decimals INTEGER,
    coingeckoId TEXT,
    wallet BOOLEAN,
    stable BOOLEAN,
    native BOOLEAN
)`

;(() => {
  for (const chain of chains) {
    database.exec(createTableQuery(chain))
  }
})()
