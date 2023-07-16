#!/usr/bin/env bun

/**
 * This is intended to be run as a script, not imported. It runs with the `bun setup` command.
 */

import { chains } from '#/constants'
import { getDatabase, insertNewTokens } from '#/database'
import { ankrGetPrice } from '#/price'
import type { Chain, Token } from '#/types'

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext) {
    const seedResult = await seed(env)
    for (const chain in seedResult) {
      await insertNewTokens({
        chain: chain as Chain,
        tokens: seedResult[chain as Chain],
        database: env.DB,
      })
    }
    return new Response('ok', { status: 200 })
  },
}

type SeedDataShape = {
  [_: string]: unknown
  tokens: Array<Token & { extensions?: object }>
}

export async function seed({ DB: database, TOKEN_LIST_URLS }: Env) {
  try {
    const chainIds = {}
    for (const chain in chains) {
      chainIds[chains[chain].id] = chain
    }
    const tokensByChain = {} as Record<Chain, Array<Token>>
    const tokenListURLs = <Array<string>>JSON.parse(TOKEN_LIST_URLS) ?? [TOKEN_LIST_URLS]
    const tokenLists = await getTokensList(tokenListURLs)
    const tokenList = tokenLists.flat()
    // remove duplicates (prefer token that has logoURI if possible)
    const deduped = {} as Record<string, Token>
    const seen = new Set()
    for (const { extensions: _, ...token } of tokenList) {
      if (
        seen.has(token.address.toLowerCase()) ||
        !chainIds[token.chainId] ||
        `${token.symbol}${token.name}`.includes('/') ||
        `${token.name.toLowerCase()}${token.symbol.toLowerCase()}`.includes('scam') ||
        JSON.stringify(token).toLowerCase().includes('[old]')
      )
        continue
      seen.add(token.address.toLowerCase())
      deduped[token.address.toLowerCase()] = token
    }

    for (const item in deduped) {
      const { address, chainId, logoURI, symbol, decimals, name } = deduped[item]
      if (!chainId) continue
      const chain = chainIds[chainId]
      if (!tokensByChain[chain]) tokensByChain[chain] = []
      tokensByChain[chain].push({
        chainId,
        address: address.toLowerCase(),
        symbol,
        name,
        decimals,
        logoURI,
      })
    }
    const payloadsByChain = {} as Record<Chain, Array<Token>>
    for (const chain in tokensByChain) {
      const insertable = tokensByChain[chain as Chain]
      payloadsByChain[chain as Chain] = insertable
    }
    return payloadsByChain
  } catch (error) {
    console.dir(error, { depth: null })
    throw error
  }
}

async function fetchTokenList(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch tokenlist.json from ${url}`)
  const json = await response.json<SeedDataShape>()
  console.log(`DONE -- fetched ${json.tokens.length} tokens from ${url}`)
  return json.tokens
}
Reflect.ownKeys

const folioChains = [
  'arbitrum',
  'avalanche',
  'bsc',
  'celo',
  // 'ethereum',
  'fantom',
  'gnosis',
  'moonbeam',
  'optimism',
  // 'polygon',
  'harmony',
] as const
type FolioChain = typeof folioChains[number]

async function getTokensList(urls: Array<string>) {
  const tokenLists = await Promise.all([...urls].map((url) => fetchTokenList(url)))
  const reshapedTokenLists = await Promise.all(
    folioChains.map((chain) => reshapeTokenList(chain as FolioChain))
  )
  tokenLists.push(...reshapedTokenLists)
  return tokenLists
}

async function reshapeTokenList(chain: FolioChain) {
  if (!folioChains.includes(chain)) return []
  const response = await fetch(
    `https://raw.githubusercontent.com/llamafolio/llamafolio-tokens/master/${chain}/tokenlist.json`
  )
  if (!response.ok) throw new Error('Failed to fetch token list')
  const json = await response.json<
    Array<{
      address: string
      name: string
      symbol: string
      decimals: number
    }>
  >()
  const tokens = json.map(({ address, ...token }) => ({
    chainId: chains[chain].id,
    address: address.toLowerCase(),
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: `https://raw.githubusercontent.com/llamafolio/llamafolio-tokens/master/${chain}/logos/${address.toLowerCase()}.png`,
  }))
  console.log(`DONE -- fetched ${tokens.length} tokens from ${chain}`)
  return tokens
}
