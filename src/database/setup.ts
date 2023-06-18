#!/usr/bin/env bun

/**
 * This is intended to be run as a script, not imported. It runs with the `bun setup` command.
 */

import { chains } from '@/constants'
import { database } from '@/database'
import type { Chain } from '@/types'

const createTableQuery = (chain: Chain) => /*sql*/ `CREATE TABLE ${chain} (
    address TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    symbol TEXT,
    chainId INTEGER,
    logoURI TEXT,
    decimals INTEGER
)`
;(() => {
	for (const chain in chains) {
		database.exec(createTableQuery(chain as Chain))
	}
})()
