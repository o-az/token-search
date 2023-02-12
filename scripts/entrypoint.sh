#!/usr/bin/env bash

set -euox pipefail

bun install

#
# this will generate node_modules.bun which contains all imported dependencies
# so we can delete node_modules folder right after. https://github.com/oven-sh/bun#why-bundle
bun bun ./src/index.ts

rm -rf node_modules

/bin/bash ./scripts/setup.sh

#
# this will allow the CMD in Dockerfile to be executed
exec "$@"
