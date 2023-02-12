___
Note: only Ethereum tokens specifically from this list are retrievable at the moment: <https://github.com/llamafolio/llamafolio-tokens/blob/master/ethereum/tokenlist.json>
___

# Three Endpoints

- ${BSAE_URL}/tokens
- ${BSAE_URL}/token/{address}
- ${BSAE_URL}/token?address={address}

### `BASE_URL`

- locally: <http://0.0.0.0:3003>
- remotely: <https://token-search-production.up.railway.app>

___

## Live demo: <https://token-search-production.up.railway.app>

___

## To get started locally

```bash
#
# clone repo
git clone https://github.com/o-az/token-search
#
# install Bun
npm install --global bun@latest
#
# install dependencies
bun install
#
# start
bun start
#
# visit the link shown in the terminal, or curl
curl http://0.0.0.0:3003/tokens # all tokens
#
# one token by address
curl http://0.0.0.0:3003/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
#
# one token by address, as a query parameter
#
curl http://0.0.0.0:3003/token?address=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
```
