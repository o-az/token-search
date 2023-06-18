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

## Live demo: <https://tokens.up.railway.app>

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

### w/o Docker

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
curl http://0.0.0.0:3003/optimism/token/0xc5b3ac2df8d8d7ac851f763a5b3ff23b4a696d59
#
# one token by address, as a query parameter
#
curl http://0.0.0.0:3003/optimism/token?address=0xc5b3ac2df8d8d7ac851f763a5b3ff23b4a696d59
#
# visit the link shown in the terminal, or curl
curl http://0.0.0.0:3003/avax/tokens # all avax tokens
#
# get token logo
curl http://0.0.0.0:3003/optimism/logo/0xc5b3ac2df8d8d7ac851f763a5b3ff23b4a696d59
# etc
```

_NOTE: the database is not persistant sicne I'm using railway.app where persistent storage is not available yet. This means all data is wiped on container restart (every deployment). But I don't care for this simple demo. If you want persistence, remove lines 5-6 in `./scripts/setup.sh` and use a different platform (fly.io, render.com, etc)_
