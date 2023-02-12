#!/usr/bin/env bash

set -euox pipefail

echo "Cleaning up last run's artifacts (if any)..."
find . -name '*.sqlite' -exec rm -rf {} \;

echo "Creating database tables..."
bun ./src/database/setup.ts
echo "Done creating tables"

echo "Seeding database..."
bun ./src/database/seed.ts
echo "Done seeding"