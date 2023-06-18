#!/usr/bin/env bun

/**
 * This is intended to be run as a script, not imported. It runs with the `bun setup` command.
 */

import { chains } from '@/constants'
import { insertNewTokens } from '@/database'
import type { Chain, Token } from '@/types'

type SeedDataShape = {
	[_: string]: unknown
	tokens: Array<Token & { extensions?: object }>
}

const TOKEN_LIST_URLS = (JSON.parse(process.env.TOKEN_LIST_URLS) ?? [
	process.env.TOKEN_LIST_URLS,
]) as Array<string>

main().catch((error) => {
	console.error(error)
	process.exit(1)
})

async function main() {
	try {
		const chainIds = {}
		for (const chain in chains) {
			chainIds[chains[chain].id] = chain
		}
		const tokensByChain = {} as Record<Chain, Array<Token>>
		const tokenLists = await getTokensList()
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
			insertNewTokens(chain as Chain, tokensByChain[chain as Chain])
			console.log(`DONE -- inserted ${tokenList.length} tokens/rows into ${chain} table`)
		}
	} catch (error) {
		console.dir(error, { depth: null })
	}
}

async function fetchTokenList(url: string) {
	const response = await fetch(url)
	if (!response.ok) throw new Error(`Failed to fetch tokenlist.json from ${url}`)
	const json = await response.json<SeedDataShape>()
	console.log(`DONE -- fetched ${json.tokens.length} tokens from ${url}`)
	return json.tokens
}

async function getTokensList() {
	const tokenLists = await Promise.all([...TOKEN_LIST_URLS].map((url) => fetchTokenList(url)))
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
