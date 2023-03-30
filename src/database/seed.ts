#!/usr/bin/env bun

/**
 * This is intended to be run as a script, not imported. It runs with the `bun setup` command.
 */

import { insertNewTokens } from '@/database'
import { chains, getTokenListURL } from '@/constants'
import type { Chain, Token } from '@/types'

async function fetchTokenList(chain: Chain) {
  const url = getTokenListURL(chain)
  const request = await fetch(url)
  const tokenList = await request.json<Array<Token>>()
  return tokenList
}

;(async () => {
  try {
    for (const chain of chains) {
      const tokenList = await fetchTokenList(chain)
      insertNewTokens(chain, tokenList)
      console.log(`DONE -- inserted ${tokenList.length} tokens/rows into ${chain} table`)
    }
  } catch (error) {
    // eslint-disable-next-line unicorn/no-null
    console.dir(error, { depth: null })
  }
})()
