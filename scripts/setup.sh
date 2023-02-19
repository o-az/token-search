#!/usr/bin/env bash

#
# this should run only when running locally
# when in container, the entrypoint.sh will run and has the same-ish commands

set -euox pipefail

echo "Cleaning up last run's artifacts (if any)..."
find . -name '*.sqlite' -exec rm -rf {} \;

echo "Creating database tables..."
bun ./src/database/setup.ts
echo "Done creating tables"

echo "Seeding database..."
bun ./src/database/seed.ts
echo "Done seeding"