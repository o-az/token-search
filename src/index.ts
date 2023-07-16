import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { cacheHeader } from 'pretty-cache-header'

import { chainNames as chains, invalidResponse } from '#/constants'
import { getAllChainTokens, getAllTokens, getToken } from '#/database'
import { IndexPage } from '#/landing'
import type { Chain, Environment } from '#/types'

const app = new Hono<{ Bindings: Environment }>()

app.use(
  '*',
  cache({
    cacheName: '_DEFAULT_',
    cacheControl: cacheHeader({
      maxAge: '1week',
      staleIfError: '1.5week',
      staleWhileRevalidate: '1year',
    }),
  })
)

app.use('*', logger())
app.use('*', cors({ origin: '*' }))
app.use('*', prettyJSON({ space: 2 }))
app.use('*', async (context, next) => {
  await next()
  context.res.headers.set('X-Powered-By', 'https://github.com/o-az/token-search')
})

app.notFound(() => new Response('Not Found', { status: 404, statusText: 'Not Found' }))

app.onError((error, context) => {
  console.error(`-- app.onError [${context.req.url}]: ${error}`, context.error)
  if (error instanceof HTTPException) return error.getResponse()
  return context.json({ message: error.message }, 500)
})

app.get('/env', (context) => {
  if (context.env['NODE_ENV'] !== 'development') {
    return new Response(JSON.stringify({ NODE_ENV: 'production' }, undefined, 2), { status: 418 })
  }
  console.log(JSON.stringify(context.env, undefined, 2))
  return context.text(JSON.stringify(context.env, undefined, 2))
})

app.get('/error', (context) => {
  console.log({ path: context.req.path, url: context.req.url, error: context.error })
  return context.json({ message: 'ok' })
})

/* TODO Auth */
app.post('/auth', async (_, next) => {
  const authorized = true
  if (!authorized)
    throw new HTTPException(401, {
      res: new Response('Unauthorized', { status: 401 }),
    })
  await next()
})

app.get('/routes', (context) => {
  app.showRoutes() // <-- this logs routes to console
  return context.json(app.routes)
})

app.get('/', (context) => context.html(IndexPage({ baseURL: context.req.url, chains })))

// available chains
app.get('/chains', (context) => context.json(chains))
app.get('/supported-chains', (context) => context.json(Object.keys(chains)))

// everything
app.get('/all', async (context) => context.json(await getAllTokens(context.env.DB)))
app.get('/everything', async (context) => context.json(await getAllTokens(context.env.DB)))

// all tokens for :chain
app.get('/:chain', async (context) => {
  const chain = <Chain>context.req.param('chain')
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const tokens = await getAllChainTokens({ chain, database: context.env.DB })
  return context.json(tokens)
})

// also all tokens for :chain
app.get('/:chain/tokens', async (context) => {
  const chain = <Chain>context.req.param('chain')
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const tokens = await getAllChainTokens({ chain, database: context.env.DB })
  return context.json(tokens)
})

// with address as path parameter
app.get('/:chain/token/:address', async (context) => {
  const { chain, address } = <{ chain: Chain; address: string }>context.req.param()
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const [token] = await getToken({
    database: context.env.DB,
    chain,
    by: 'address',
    value: address,
  })
  if (!token) return context.json(invalidResponse.token)
  return context.json(token)
})

// with address as query parameter
app.get('/:chain/token', async (context) => {
  const chain = <Chain>context.req.param('chain')
  const { address } = context.req.query()
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const [token] = await getToken({
    database: context.env.DB,
    chain,
    by: 'address',
    value: address,
  })
  if (!token) return context.json(invalidResponse.token)
  return context.json(token)
})

// token logo
app.get('/:chain/logo/:address', async (context) => {
  const { chain, address } = <{ chain: Chain; address: string }>context.req.param()
  if (!chains.includes(chain)) return context.json(invalidResponse.chain)
  const [token] = await getToken({
    database: context.env.DB,
    chain,
    by: 'address',
    value: address,
  })
  if (!token) return context.json(invalidResponse.token)
  if (!token.logoURI) return context.json({ message: 'Not found' }, 404)
  return context.html(/*html*/ `<img src="${token.logoURI}" />`)
})

export default app
