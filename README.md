
#### - Deployed on [Cloudflare Workers](https://workers.cloudflare.com/),
#### - using [Hono](https://hono.dev/) web framework,
#### - and [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) for database

# Endpoints

- view all tokens of {chain}:
  - `${BASE_URL}/{chain}`
- get a specific token from {chain} using token {address}:
  - `${BASE_URL}/{chain}/token/{address}`
- same as above but token {address} as supplied as query parameter:
  - `${BASE_URL}/{chain}/token?address={address}`
- get token logo by address:
  - `${BASE_URL}/{chain}/logo/{address}`

---

## Live demo: <https://tokens.evm.workers.dev>
