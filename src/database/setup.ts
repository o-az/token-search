#!/usr/bin/env bun

/**
 * This script is intended to be run from the command line using the command `pnpm setup`.
 * `pnpm setup` will first run `./setup.sh`, head over to that file to see what it does.
 */

import { chains } from '@/constants';
import type { Chain } from '@/types';
import { database } from '@/database';

const createTableQuery = (chain: Chain) => /*sql*/ `CREATE TABLE ${chain} (
    address TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    symbol TEXT,
    decimals INTEGER,
    coingeckoId TEXT,
    wallet BOOLEAN,
    stable BOOLEAN,
    native BOOLEAN
)`;

(() => {
  for (const chain of chains) {
    database.exec(createTableQuery(chain));
  }
})();
