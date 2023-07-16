#!/usr/bin/env bash

#
# this should run only when running locally
# when in container, the entrypoint.sh will run and has the same-ish commands

set -euox pipefail

source .env

DATABASE_NAME="tokens"

echo "Cleaning up last run's artifacts (if any)..."
find . -name '*.sqlite' -exec rm -rf {} \;

CHAINS="ethereum optimism gnosis arbitrum polygon celo moonbeam avalanche fantom bsc harmony goerli"

for chain in $CHAINS; do
  SQL_QUERY="CREATE TABLE $chain (
    address TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    symbol TEXT,
    chainId INTEGER,
    decimals INTEGER,
    logoURI TEXT
  )"

  echo "Creating table for $chain"

  wrangler d1 \
    execute \
    $DATABASE_NAME \
    --local \
    --command="$SQL_QUERY" \
    --experimental-json-config \
    --config='./wrangler.json' \
    --json \
    --yes
done

echo "Done!"
