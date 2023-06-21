import type { Chain } from '@/types'

const _createTableQuery = (chain: Chain) => /*sql*/ `
    CREATE TABLE ${chain} (
        address TEXT UNIQUE PRIMARY KEY,
        name TEXT,
        symbol TEXT,
        chainId INTEGER,
        logoURI TEXT,
        decimals INTEGER
    )`
// ;(() => {
// 	for (const chain in chains) {
// 		database.exec(createTableQuery(chain as Chain))
// 	}
// })()
