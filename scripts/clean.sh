#!/bin/sh

# Find all node_modules folders and remove them recursively
echo "Removing all node_modules folders..."
find . -name 'node_modules' -exec rm -rf {} \;

# Find all files that end with .sqlite and remove them
echo "Removing all .sqlite files..."
find . -name '*.sqlite' -exec rm -rf {} \;

echo "Removing all lock files..."
rm -rf package-lock.json yarn.lock pnpm-lock.yaml bun.*

echo "Done."
