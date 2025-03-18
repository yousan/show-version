#!/usr/bin/env bash
#
# CLI Examples for show-version
#
# Make this script executable with:
#   chmod +x examples/cli-examples.sh
#
# Then run:
#   ./examples/cli-examples.sh
#

# Save current directory to return to it later
CURRENT_DIR=$(pwd)

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1

echo "====================== show-version CLI Examples ======================"
echo ""

echo "Example 1: Default output"
echo "Command: node bin/cli.js"
node bin/cli.js
echo ""

echo "Example 2: Custom format"
echo "Command: node bin/cli.js --format '{tag}+{hash}'"
node bin/cli.js --format '{tag}+{hash}'
echo ""

echo "Example 3: Excluding components"
echo "Command: node bin/cli.js --no-branch"
node bin/cli.js --no-branch
echo ""

echo "Example 4: Showing dirty flag"
echo "Command: node bin/cli.js --dirty"
node bin/cli.js --dirty
echo ""

echo "Example 5: Custom dirty suffix"
echo "Command: node bin/cli.js --dirty --dirty-suffix '-modified'"
node bin/cli.js --dirty --dirty-suffix '-modified'
echo ""

echo "Example 6: Help information"
echo "Command: node bin/cli.js --help"
echo "(Output truncated for brevity - run with --help to see full help)"
echo ""

# Return to the original directory
cd "$CURRENT_DIR" || exit 1

echo "All examples completed." 