#!/usr/bin/env node
import { insertNewTokens } from '@/database';
import { chains, getTokenListURL } from '@/constants';
import type { Chain, Token } from '@/types';

/**
 * This script is intended to be run from the command line using the command `pnpm seed`
 */

export async function fetchTokenList(chain: Chain) {
  const url = getTokenListURL(chain);
  const request = await fetch(url);
  const tokenList = (await request.json()) as Array<Token>;
  return tokenList;
}

async function main() {
  try {
    for (const chain of chains) {
      const tokenList = await fetchTokenList(chain);
      insertNewTokens(chain, tokenList);
      console.log(`DONE -- inserted ${tokenList.length} tokens/rows into ${chain} table`);
    }
  } catch (error) {
    // eslint-disable-next-line unicorn/no-null
    console.dir(error, { depth: null });
  }
}

main();
