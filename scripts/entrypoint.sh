#!/usr/bin/env bash

set -euox pipefail

bun install

exec "$@"