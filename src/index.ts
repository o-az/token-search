import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import type { Chain } from '@/types'
import { IndexPage } from '@/landing'
import { getAllTokens, getToken } from '@/database'
import { baseURL, chains, invalidResponse } from '@/constants'

const app = new Hono()

app.use('*', logger())
app.use('*', prettyJSON())

app.notFound(context => context.json({ code: 404, message: 'Not found' }, 404))

app.onError((error, context) => context.json({ code: 500, message: error.message }, 500))

app.get('/', context => context.html(IndexPage({ baseURL, chains })))

// all tokens for :chain
app.get('/:chain', context => {
  const chain = <Chain>context.req.param('chain')
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  return context.json({ success: true, data: getAllTokens(chain) })
})

// also all tokens for :chain
app.get('/:chain/tokens', context => {
  const chain = <Chain>context.req.param('chain')
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  return context.json({ success: true, data: getAllTokens(chain) })
})

// with address as path parameter
app.get('/:chain/token/:address', context => {
  const { chain, address } = <{ chain: Chain; address: string }>context.req.param()
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const token = getToken(chain, { by: 'address', value: address })
  if (token.length === 0) return context.json(invalidResponse.token)
  return context.json({ success: true, data: token })
})

// with address as query parameter
app.get('/:chain/token', context => {
  const chain = <Chain>context.req.param('chain')
  const { address } = context.req.query()
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const token = getToken(chain, { by: 'address', value: address })
  if (token.length === 0) return context.json(invalidResponse.token)
  return context.json({ success: true, data: token })
})

export default {
  port: process.env.PORT || 3003,
  fetch: app.fetch,
}
