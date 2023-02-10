#!/usr/bin/env node

/**
 * This script is intended to be run from the command line using the command `pnpm setup`.
 * `pnpm setup` will first run `./setup.sh`, head over to that file to see what it does.
 */

import { database } from '@/database';

const createTableQuery = /*sql*/ `CREATE TABLE token (
    address TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    symbol TEXT,
    decimals INTEGER,
    coingeckoId TEXT,
    wallet BOOLEAN,
    stable BOOLEAN,
    native BOOLEAN
)`;

database.exec(createTableQuery);
