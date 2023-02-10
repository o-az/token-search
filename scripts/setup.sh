#!/usr/bin/env bash

set -euox pipefail

# Check if `tokens.sqlite` exists, if yes then rename to <datetime>_tokens.sqlite

if [ -f tokens.sqlite ]; then
  mv tokens.sqlite "$(date +%s)_tokens.sqlite"
fi
