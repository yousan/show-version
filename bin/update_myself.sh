#!/bin/bash

# Simple script to update version information in package.json and README.md
# Usage: ./bin/update_myself.sh 1.2.3

set -e  # Exit immediately if a command exits with a non-zero status

# Check arguments
if [ $# -ne 1 ]; then
  echo "Usage: $0 <new_version_number>"
  echo "Example: $0 1.2.3"
  exit 1
fi

NEW_VERSION=$1
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PACKAGE_JSON="$ROOT_DIR/package.json"
README_MD="$ROOT_DIR/README.md"

# Get current version
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' "$PACKAGE_JSON" | cut -d'"' -f4)
echo "Updating version from $CURRENT_VERSION to $NEW_VERSION"

# Update package.json
sed -i '' 's/"version": "'$CURRENT_VERSION'"/"version": "'$NEW_VERSION'"/' "$PACKAGE_JSON"

# Get current Git information
CURRENT_BRANCH=$(node -e "console.log(require('$ROOT_DIR/src/index.js').getVersion({format: '{branch}', tag: false, commitHash: false}))")
CURRENT_HASH=$(node -e "console.log(require('$ROOT_DIR/src/index.js').getVersion({format: '{hash}', tag: false, branchName: false}))")
HAS_CHANGES=$(node -e "console.log(require('$ROOT_DIR/src/index.js').hasChanges())")

DIRTY_FLAG=""
if [ "$HAS_CHANGES" = "true" ]; then
  DIRTY_FLAG="%20(dirty)"
fi

# Update README badges
# Update version badge
sed -i '' "s/version-[0-9.]*-blue/version-$NEW_VERSION-blue/g" "$README_MD"
sed -i '' "s|/tag/v[0-9.]*|/tag/v$NEW_VERSION|g" "$README_MD"

# Update Git badge
ESCAPED_BRANCH=`echo $CURRENT_BRANCH | sed 's/\//%2F/g'`
sed -i '' "s|git-[^-]*-orange|git-$ESCAPED_BRANCH%40$CURRENT_HASH$DIRTY_FLAG-orange|g" "$README_MD"
sed -i '' "s|/commit/[a-f0-9]*|/commit/$CURRENT_HASH|g" "$README_MD"

# Update query parameters for NPM badges and others
sed -i '' "s/?v=[0-9.]*/?v=$NEW_VERSION/g" "$README_MD"

# Fix GitHub last-commit badge if broken
sed -i '' "s|/last-commit/[^/]*/|/last-commit/|g" "$README_MD"

echo "Update completed!"
echo "Modified files:"
echo "- $PACKAGE_JSON"
echo "- $README_MD"
