#!/bin/bash

# Simple script to update version information in package.json and README.md based on current Git information
# Uses show-version itself to determine the current version
# Usage: ./bin/update_myself.sh

set -e  # Exit immediately if a command exits with a non-zero status

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PACKAGE_JSON="$ROOT_DIR/package.json"
README_MD="$ROOT_DIR/README.md"

# Get branch info first
BRANCH=$(node -e "console.log(require('$ROOT_DIR/src/index.js').getVersion({format: '{branch}', tag: false, commitHash: false}))")

# Check if we're on a release branch, and extract version if so
if [[ "$BRANCH" == release/* ]]; then
  # Extract version from release branch name
  RELEASE_VERSION=$(echo $BRANCH | sed -E 's/release\/v?([0-9]+\.[0-9]+\.[0-9]+)/\1/')
  if [[ "$RELEASE_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    VERSION="$RELEASE_VERSION"
    echo "Using version from release branch: $VERSION"
  else
    # Fallback to tag-based version if extraction fails
    VERSION=$(node -e "console.log(require('$ROOT_DIR/src/index.js').getVersion({format: '{tag}', branchName: false, commitHash: false}))")
    echo "Could not extract version from branch name, using tag-based version"
  fi
else
  # Get version from tag if not on a release branch
  VERSION=$(node -e "console.log(require('$ROOT_DIR/src/index.js').getVersion({format: '{tag}', branchName: false, commitHash: false}))")
fi

# Get other Git information
HASH=$(node -e "console.log(require('$ROOT_DIR/src/index.js').getVersion({format: '{hash}', tag: false, branchName: false}))")
HAS_CHANGES=$(node -e "console.log(require('$ROOT_DIR/src/index.js').hasChanges())")

echo "----------------------------------------"
echo "VERSION UPDATE INFORMATION"
echo "----------------------------------------"
echo "Detected version: $VERSION"
echo "Branch: $BRANCH"
echo "Commit hash: $HASH"

# Set dirty flag if working directory has changes
DIRTY_FLAG=""
if [ "$HAS_CHANGES" = "true" ]; then
  DIRTY_FLAG="%20(dirty)"
  echo "Status: Dirty (uncommitted changes)"
else
  echo "Status: Clean"
fi

echo "----------------------------------------"
echo "UPDATING README BADGES TO VERSION: $VERSION"
echo "----------------------------------------"

# Update README badges
echo "Updating README.md with version information..."

# Update version badge
sed -i '' "s/version-[0-9.]*-blue/version-$VERSION-blue/g" "$README_MD"
sed -i '' "s|/tag/v[0-9.]*|/tag/v$VERSION|g" "$README_MD"

# Update Git badge
ESCAPED_BRANCH=`echo $BRANCH | sed 's/\//%2F/g'`
sed -i '' "s|git-[^-]*-orange|git-$ESCAPED_BRANCH%40$HASH$DIRTY_FLAG-orange|g" "$README_MD"
sed -i '' "s|/commit/[a-f0-9]*|/commit/$HASH|g" "$README_MD"

# Update query parameters for NPM badges and others
sed -i '' "s/?v=[0-9.]*/?v=$VERSION/g" "$README_MD"

# Fix GitHub last-commit badge if broken
sed -i '' "s|/last-commit/[^/]*/|/last-commit/|g" "$README_MD"

echo "----------------------------------------"
echo "Update completed!"
echo "README has been updated to version: $VERSION"
echo "Modified file:"
echo "- $README_MD"
echo "----------------------------------------"
