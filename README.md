# show-version
<!-- auto rewrite started here -->
[![Version](https://img.shields.io/badge/version-1.5.14-blue.svg)](https://github.com/yousan/show-version/releases/tag/v1.5.14)

[![npm version](https://img.shields.io/npm/v/show-version.svg?v=1.5.14)](https://www.npmjs.com/package/show-version)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/yousan/show-version?v=1.5.14)](https://github.com/yousan/show-version)
[![GitHub last commit](https://img.shields.io/github/last-commit/yousan/show-version?v=1.5.14)](https://github.com/yousan/show-version/commits)
<!-- auto rewrite end here -->


[![GitHub license](https://img.shields.io/badge/github/license/yousan/show-version?v=1.0.0)](https://github.com/yousan/show-version/blob/main/LICENSE)

A simple utility to extract version identifiers (tags, branch names, commit hashes, etc.) from Git repositories. **No Git binary dependency** - operates with pure JavaScript implementation.

## Demo

You can see a live demo of this library at:
[show-version React Demo](https://yousan.github.io/show-version/)

This demo shows how to integrate and use show-version in a React application to display version information.

## Quick Examples

### React

```jsx
// Build configuration (webpack.config.js)
const { getVersion } = require('@yousan/show-version');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(getVersion()),
      'process.env.BUILD_DATE': JSON.stringify(new Date().toISOString())
    }),
  ],
};

// Basic version display
import React from 'react';

const AppVersion = () => (
  <div className="app-version">Version: {process.env.APP_VERSION}</div>
);

// Version display with date information
const VersionWithDate = () => (
  <div className="version-info">
    <div>Version: {process.env.APP_VERSION}</div>
    <div>Build Date: {new Date(process.env.BUILD_DATE).toLocaleString()}</div>
  </div>
);

// Combined version, commit hash, and date display
const FullVersionInfo = () => {
  // Version obtained from show-version
  const version = process.env.APP_VERSION;
  // Extract hash part from version (e.g., get a4ea60e from v1.3.0-main-a4ea60e)
  const commitHash = version.split('-').pop();
  
  return (
    <div className="version-detail">
      <div><strong>Version:</strong> {version}</div>
      <div><strong>Commit:</strong> <a href={`https://github.com/your-repo/commit/${commitHash}`}>{commitHash}</a></div>
      <div><strong>Built:</strong> {new Date(process.env.BUILD_DATE).toLocaleString()}</div>
    </div>
  );
};

export { AppVersion, VersionWithDate, FullVersionInfo };
```

### Vue

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { getVersion } from '@yousan/show-version';

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.APP_VERSION': JSON.stringify(getVersion())
  }
});
```

```vue
<!-- AppVersion.vue -->
<template>
  <div class="app-version">Version: {{ version }}</div>
</template>

<script>
export default {
  data() {
    return {
      version: process.env.APP_VERSION
    }
  }
}
</script>
```

### CI/CD Pipeline Integration

```yaml
# GitHub Actions workflow example
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Get full history for accurate version information
      
      - name: Get Version Info
        id: version
        run: |
          # Standard version format
          VERSION=$(npx show-version)
          echo "VERSION=$VERSION" >> $GITHUB_ENV
          
          # Version with datetime
          DATED_VERSION=$(npx show-version --format "{tag}-{datetime}" --datetime-format YYYYMMDDHHmmss)
          echo "DATED_VERSION=$DATED_VERSION" >> $GITHUB_ENV
          
          # Deploy identifier (short hash and date)
          DEPLOY_ID=$(npx show-version --format "{hash}-{datetime}" --datetime-format YYYYMMDD)
          echo "DEPLOY_ID=$DEPLOY_ID" >> $GITHUB_ENV
      
      - name: Build with version info
        run: |
          echo "Building version: ${{ env.VERSION }}"
          echo "Date stamped version: ${{ env.DATED_VERSION }}"
          echo "Deploy ID: ${{ env.DEPLOY_ID }}"
          
          # Pass version information as environment variables
          REACT_APP_VERSION="${{ env.VERSION }}" npm run build
```

### Node.js Script Usage

```javascript
// Deployment history recording
const fs = require('fs');
const { getVersionAsync } = require('@yousan/show-version');

async function recordDeployment() {
  // Standard version
  const version = await getVersionAsync();
  
  // Version with datetime (custom format)
  const datedVersion = await getVersionAsync({
    format: '{tag}-{datetime}',
    datetimeFormat: 'ISO'
  });
  
  // Commit hash only
  const commitHash = await getVersionAsync({
    format: '{hash}',
    tag: false,
    branchName: false
  });
  
  // Check for changes
  const { hasChangesAsync } = require('@yousan/show-version');
  const isDirty = await hasChangesAsync();
  
  // Deployment record
  const record = {
    version,
    datedVersion,
    commitHash,
    isDirty,
    timestamp: new Date().toISOString()
  };
  
  // Save as JSON
  fs.writeFileSync(
    `deploy-history/${record.timestamp.split('T')[0]}.json`,
    JSON.stringify(record, null, 2)
  );
  
  console.log(`Deployment recorded: ${version} (${record.timestamp})`);
}

recordDeployment().catch(console.error);
```

## Features

- **No Git Binary Dependency**: Works even if Git is not installed on the system
- **Isomorphic Git**: Implements Git operations in pure JavaScript
- **Sync & Async APIs**: Provides both interfaces
- **Customizable**: Flexible configuration for output formats and options

## Installation

### Global Installation

```bash
npm install -g show-version
```

### Project Installation

```bash
npm install --save show-version
```

## Usage

### CLI Tool

```bash
# Default output format (tag-branch-hash)
show-version

# Custom format
show-version --format "{tag}-{hash}"

# Exclude tag information
show-version --no-tag

# Add -dirty flag for uncommitted changes
show-version --dirty

# Specify a different Git repository
show-version --dir /path/to/repo

# Display help
show-version --help
```

### Node.js Usage (Async API)

```javascript
const { getVersionAsync, hasChangesAsync } = require('show-version');

// Using async API
async function example() {
  // Get version with default options
  const version = await getVersionAsync();
  console.log('Current version:', version);

  // With custom options
  const customVersion = await getVersionAsync({
    format: '{tag}+{hash}',
    branchName: false,  // Exclude branch name
    dir: '/path/to/repo' // Specify repository path
  });
  console.log('Custom version:', customVersion);

  // Check for uncommitted changes
  if (await hasChangesAsync()) {
    console.log('Uncommitted changes detected');
  }
}

example();
```

### Sync API Usage (Not Recommended)

```javascript
const { getVersion, hasChanges } = require('show-version');

// Using sync API (not recommended for performance reasons - uses async operations internally)
const version = getVersion();
console.log('Current version:', version);

// Check for changes
if (hasChanges()) {
  console.log('Uncommitted changes detected');
}
```

## Options

### CLI Options

| Option         | Description                           | Default Value            |
| -------------- | ------------------------------------- | ------------------------ |
| --format, -f   | Output format                         | {tag}-{branch}-{hash}    |
| --no-tag       | Exclude tag information               | false                    |
| --no-branch    | Exclude branch name                   | false                    |
| --no-hash      | Exclude commit hash                   | false                    |
| --dirty, -d    | Add flag for uncommitted changes      | false                    |
| --dirty-suffix | String to append when dirty           | -dirty                   |
| --dir          | Git repository directory path         | . (current directory)    |

### API Options

```javascript
getVersionAsync({
  format: '{tag}-{branch}-{hash}', // Output format
  tag: true,                       // Include tag info
  branchName: true,                // Include branch name
  commitHash: true,                // Include commit hash
  dir: '/path/to/repo'             // Git repository path (default: current directory)
});
```

## Examples

For complete usage examples, check the `examples/` directory:

- **Basic Usage**: [examples/basic-usage.js](examples/basic-usage.js)
- **CLI Examples**: [examples/cli-examples.sh](examples/cli-examples.sh)
- **CI/CD Integration**: [examples/ci-integration.js](examples/ci-integration.js)

Run examples using npm scripts:

```bash
# Basic API usage example
npm run example:basic

# CLI usage examples
npm run example:cli

# CI/CD integration example
npm run example:ci
```

## Testing

Run tests using:

```bash
npm test
```

## Project Structure

```
show-version/
├── bin/           - CLI executables
├── src/           - Source code
├── examples/      - Usage examples
├── test/          - Test files
├── LICENSE        - MIT License
└── README.md      - Documentation
```

## Technical Details

This package uses [isomorphic-git](https://isomorphic-git.org/) and operates without requiring the Git binary. This means it can work in environments where Git is not installed, or potentially in non-Node.js environments (like browsers).

### Async vs Sync API

We recommend using the async API (`getVersionAsync` and `hasChangesAsync`). The sync API (`getVersion` and `hasChanges`) implements workarounds to handle async operations synchronously, which may lead to performance issues.

## License

MIT 