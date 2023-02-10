#!/usr/bin/env node
import { insertNewTokens } from '@/database';
import { TOKEN_LIST_URL } from '@/constants';
import type { Token } from '@/types';

/**
 * This script is intended to be run from the command line using the command `pnpm seed`
 */

export async function fetchTokenList(url = TOKEN_LIST_URL) {
  const request = await fetch(url);
  const tokenList = (await request.json()) as Array<Token>;
  return tokenList;
}

async function main() {
  try {
    const tokenList = await fetchTokenList(TOKEN_LIST_URL);
    insertNewTokens(tokenList);
    console.log(`DONE -- inserted ${tokenList.length} tokens/rows`);
  } catch (error) {
    // eslint-disable-next-line unicorn/no-null
    console.dir(error, { depth: null });
  }
}

main();
