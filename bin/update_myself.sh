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

# Remove leading 'v' if present to avoid duplication
VERSION=${VERSION#v}

echo "----------------------------------------"
echo "VERSION UPDATE INFORMATION"
echo "----------------------------------------"
echo "Detected version: $VERSION"
echo "Branch: $BRANCH"

echo "----------------------------------------"
echo "UPDATING README BADGES TO VERSION: $VERSION"
echo "----------------------------------------"

# Check if the README contains the auto-rewrite markers
if grep -q "<!-- auto rewrite started here -->" "$README_MD" && grep -q "<!-- auto rewrite end here -->" "$README_MD"; then
  echo "Found auto-rewrite markers in README.md"
  
  # Create temporary file for the updated content
  TMP_FILE=$(mktemp)
  
  # Extract the part before the auto-rewrite section
  sed -n '1,/<!-- auto rewrite started here -->/p' "$README_MD" > "$TMP_FILE"
  
  # Generate the auto-rewrite content with updated version information
  echo "[![Version](https://img.shields.io/badge/version-$VERSION-blue.svg)](https://github.com/yousan/show-version/releases/tag/v$VERSION)" >> "$TMP_FILE"
  echo "" >> "$TMP_FILE"
  echo "[![npm version](https://img.shields.io/npm/v/show-version.svg?v=$VERSION)](https://www.npmjs.com/package/show-version)" >> "$TMP_FILE"
  echo "[![GitHub package.json version](https://img.shields.io/github/package-json/v/yousan/show-version?v=$VERSION)](https://github.com/yousan/show-version)" >> "$TMP_FILE"
  echo "[![GitHub last commit](https://img.shields.io/github/last-commit/yousan/show-version?v=$VERSION)](https://github.com/yousan/show-version/commits)" >> "$TMP_FILE"
  
  # Extract the part after the auto-rewrite section
  sed -n '/<!-- auto rewrite end here -->/,$p' "$README_MD" >> "$TMP_FILE"
  
  # Replace the original README with the new content
  mv "$TMP_FILE" "$README_MD"
  
  echo "Updated auto-rewrite section of README.md"
else
  echo "Warning: Auto-rewrite markers not found in README.md"
  echo "Please add <!-- auto rewrite started here --> and <!-- auto rewrite end here --> around the badge section in README.md"
  echo "Continuing with global replacements as fallback..."
  
  # Fallback to previous method for backward compatibility
  # Update version badge
  sed -i '' "s/version-[0-9.]*-blue/version-$VERSION-blue/g" "$README_MD"
  sed -i '' "s|/tag/v[0-9.]*|/tag/v$VERSION|g" "$README_MD"

  # Remove Git badge if it exists
  sed -i '' '/git-.*-orange/d' "$README_MD"

  # Update query parameters for NPM badges and others
  sed -i '' "s/?v=[0-9.]*/?v=$VERSION/g" "$README_MD"

  # Fix GitHub last-commit badge if broken
  sed -i '' "s|/last-commit/[^/]*/|/last-commit/|g" "$README_MD"
fi

echo "----------------------------------------"
echo "Update completed!"
echo "README has been updated to version: $VERSION"
echo "Modified file:"
echo "- $README_MD"
echo "----------------------------------------"
