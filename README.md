# Endpoints

- view all tokens of {chain}:
  - `${BASE_URL}/{chain}`
- get a specific token from {chain} using token {address}:
  - `${BASE_URL}/{chain}/token/{address}`
- same as above but token {address} as supplied as query parameter:
  - `${BASE_URL}/{chain}/token?address={address}`

---

## Live demo: <https://token-search-production.up.railway.app>

---

## To get started locally

### With Docker

```bash
git clone https://github.com/o-az/token-search
cd token-search
#
# build image
docker build --no-cache --file ./Dockerfile --tag token_search . --progress=plain
#
# start container and expose port (make sure port 3003 is not in use)
docker run --privileged --publish 3003:3003 --rm -it --detach --name token_search token_search
#
# query
curl http://0.0.0.0:3003/ethereum
#
# to get inside the container and mess around
docker exec --privileged -it token_search /bin/bash
```

### Locally w/o Docker

```bash
git clone https://github.com/o-az/token-search
cd token-search
#
# install Bun if you don't already have it
npm install --global bun@latest
#
# Upgrade Bun if not latest version
bun upgrade
#
# install dependencies
bun install
#
# setup - creates sqlite database file and seeds it
bun setup
#
# run server
bun start
```

### Start querying

```bash
#
# all eth tokens
curl http://0.0.0.0:3003/ethereum/tokens
#
# one token by address
curl http://0.0.0.0:3003/ethereum/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
#
# one token by address, as a query parameter
#
curl http://0.0.0.0:3003/ethereum/token?address=0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab
#
# visit the link shown in the terminal, or curl
curl http://0.0.0.0:3003/avax/tokens # all avax tokens
#
# etc
```
