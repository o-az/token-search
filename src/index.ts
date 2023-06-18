import { baseURL, chainNames as chains, invalidResponse } from '@/constants'
import { getAllChainTokens, getAllTokens, getToken } from '@/database'
import { IndexPage } from '@/landing'
import type { Chain } from '@/types'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors()) // <-- stricter cors soon

app.notFound((context) => context.json({ code: 404, message: 'Not found' }, 404))

app.onError((error, context) => context.json({ code: 500, message: error.message }, 500))

app.get('/', (context) => context.html(IndexPage({ baseURL, chains })))

// available chains
app.get('/chains', (context) => context.json(chains))

// everything
app.get('/everything', (context) => {
	const tokens = getAllTokens()
	return context.json(tokens)
})

// all tokens for :chain
app.get('/:chain', (context) => {
	const chain = <Chain>context.req.param('chain')
	if (!chains.includes(chain)) return context.json(invalidResponse.chain)
	return context.json(getAllChainTokens(chain))
})

// also all tokens for :chain
app.get('/:chain/tokens', (context) => {
	const chain = <Chain>context.req.param('chain')
	if (!chains.includes(chain)) return context.json(invalidResponse.chain)
	return context.json(getAllChainTokens(chain))
})

// with address as path parameter
app.get('/:chain/token/:address', (context) => {
	const { chain, address } = <{ chain: Chain; address: string }>context.req.param()
	if (!chains.includes(chain)) return context.json(invalidResponse.chain)
	const [token] = getToken(chain, { by: 'address', value: address })
	if (!token) return context.json(invalidResponse.token)
	return context.json(token)
})

// with address as query parameter
app.get('/:chain/token', (context) => {
	const chain = <Chain>context.req.param('chain')
	const { address } = context.req.query()
	if (!chains.includes(chain)) return context.json(invalidResponse.chain)
	const [token] = getToken(chain, { by: 'address', value: address })
	if (!token) return context.json(invalidResponse.token)
	return context.json(token)
})

// token logo
app.get('/:chain/logo/:address', (context) => {
	const { chain, address } = <{ chain: Chain; address: string }>context.req.param()
	if (!chains.includes(chain)) return context.json(invalidResponse.chain)
	const [token] = getToken(chain, { by: 'address', value: address })
	if (!token) return context.json(invalidResponse.token)
	if (!token.logoURI) return context.json({ message: 'Not found' }, 404)
	return context.html(/*html*/ `<img src="${token.logoURI}" />`)
})


export default {
	port: process.env.PORT || 3003,
	fetch: app.fetch,
}
