#!/usr/bin/env bash

set -euox pipefail

echo "Creating database tables..."
bun ./src/database/setup.ts
echo "Done creating tables"

echo "Seeding database..."
bun ./src/database/seed.ts
echo "Done seeding"

#
# this will allow the CMD in Dockerfile to be executed
exec "$@"
