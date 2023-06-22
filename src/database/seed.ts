#!/usr/bin/env bun

/**
 * This is intended to be run as a script, not imported. It runs with the `bun setup` command.
 */

import { chains } from '#/constants'
import { insertNewTokens } from '#/database'
import type { Chain, Token } from '#/types'

type SeedDataShape = {
  [_: string]: unknown
  tokens: Array<Token & { extensions?: object }>
}

export async function seed({ DB: database, TOKEN_LIST_URLS }: Env): Promise<'success' | 'fail'> {
  try {
    const chainIds = {}
    for (const chain in chains) {
      chainIds[chains[chain].id] = chain
    }
    const tokensByChain = {} as Record<Chain, Array<Token>>
    const tokenListURLs = <Array<string>>JSON.parse(TOKEN_LIST_URLS) ?? [TOKEN_LIST_URLS]
    const tokenLists = await getTokensList(tokenListURLs)
    const tokenList = tokenLists.flat()
    // sort by has logoURI
    tokenList.sort((a, b) => {
      if (a.logoURI && !b.logoURI) return -1
      if (!a.logoURI && b.logoURI) return 1
      return 0
    })
    // remove duplicates (prefer token that has logoURI if possible)
    const deduped = {} as Record<string, Token>
    const seen = new Set()
    for (const { extensions: _, ...token } of tokenList) {
      if (
        seen.has(token.address.toLowerCase()) ||
        !chainIds[token.chainId] ||
        `${token.symbol}${token.name}`.includes('/') ||
        `${token.name.toLowerCase()}${token.symbol.toLowerCase()}`.includes('factory') ||
        JSON.stringify(token).includes('old')
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
    for (const chain in tokensByChain) {
      const insertable = tokensByChain[chain as Chain]
      await insertNewTokens({ chain: chain as Chain, tokens: insertable, database })
      console.log(`DONE -- inserted ${insertable.length} tokens into ${chain}`)
    }
    return 'success'
  } catch (error) {
    console.dir(error, { depth: null })
    return 'fail'
  }
}

async function fetchTokenList(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch tokenlist.json from ${url}`)
  const json = await response.json<SeedDataShape>()
  console.log(`DONE -- fetched ${json.tokens.length} tokens from ${url}`)
  return json.tokens
}

async function getTokensList(urls: Array<string>) {
  const tokenLists = await Promise.all([...urls].map((url) => fetchTokenList(url)))
  const reshapedTokenLists = await Promise.all(
    Object.keys(chains).map((chain) => reshapeTokenList(chain as FolioChain))
  )
  tokenLists.push(...reshapedTokenLists)
  return tokenLists
}

const folioChains = [
  'arbitrum',
  'avalanche',
  'bsc',
  'celo',
  'ethereum',
  'fantom',
  'gnosis',
  'moonbeam',
  'optimism',
  'polygon',
  'harmony',
] as const
type FolioChain = typeof folioChains[number]

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
  return tokens
}
