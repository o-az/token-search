___
Note: only Ethereum tokens specifically from this list are retrievable at the moment: <https://github.com/llamafolio/llamafolio-tokens/blob/master/ethereum/tokenlist.json>
___

# Two Endpoints

- ${BSAE_URL}/token/{address}
- ${BSAE_URL}/token?address={address}

### `BASE_URL`:
- locally: http://0.0.0.0:3003
- remotely: https://token-search-production.up.railway.app

----
## Live demo: https://token-search-production.up.railway.app
----
## To get started locally:

```sh
npm install --global bun@latest
```

```sh
bun install
```

```sh
bun start
```