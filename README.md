# show-version
<!-- auto rewrite started here -->
[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](https://github.com/yousan/show-version/releases/tag/v1.4.0)

[![npm version](https://img.shields.io/npm/v/show-version.svg?v=1.4.0)](https://www.npmjs.com/package/show-version)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/yousan/show-version?v=1.4.0)](https://github.com/yousan/show-version)
[![GitHub last commit](https://img.shields.io/github/last-commit/yousan/show-version?v=1.4.0)](https://github.com/yousan/show-version/commits)
<!-- auto rewrite end here -->


[![GitHub license](https://img.shields.io/github/license/yousan/show-version?v=1.0.0)](https://github.com/yousan/show-version/blob/main/LICENSE)

A simple utility to extract version identifiers (tags, branch names, commit hashes, etc.) from Git repositories. **No Git binary dependency** - operates with pure JavaScript implementation.

## Quick Examples

### React

```jsx
// ビルド設定 (webpack.config.js)
const { getVersion } = require('@yousan/show-version');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(getVersion()),
      'process.env.BUILD_DATE': JSON.stringify(new Date().toISOString())
    }),
  ],
};

// 基本的なバージョン表示
import React from 'react';

const AppVersion = () => (
  <div className="app-version">Version: {process.env.APP_VERSION}</div>
);

// 日時情報も含むバージョン表示
const VersionWithDate = () => (
  <div className="version-info">
    <div>Version: {process.env.APP_VERSION}</div>
    <div>Build Date: {new Date(process.env.BUILD_DATE).toLocaleString()}</div>
  </div>
);

// バージョン・コミットハッシュ・日時を組み合わせた表示
const FullVersionInfo = () => {
  // show-versionから取得したバージョン
  const version = process.env.APP_VERSION;
  // バージョンからハッシュ部分を抽出（例：v1.3.0-main-a4ea60e から a4ea60e を取得）
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

### CI/CD パイプラインでの活用

```yaml
# GitHub Actions ワークフロー例
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 全履歴を取得して正確なバージョン情報を得る
      
      - name: Get Version Info
        id: version
        run: |
          # 標準形式のバージョン
          VERSION=$(npx show-version)
          echo "VERSION=$VERSION" >> $GITHUB_ENV
          
          # 日時を含むバージョン
          DATED_VERSION=$(npx show-version --format "{tag}-{datetime}" --datetime-format YYYYMMDDHHmmss)
          echo "DATED_VERSION=$DATED_VERSION" >> $GITHUB_ENV
          
          # デプロイ識別子（短いハッシュと日付）
          DEPLOY_ID=$(npx show-version --format "{hash}-{datetime}" --datetime-format YYYYMMDD)
          echo "DEPLOY_ID=$DEPLOY_ID" >> $GITHUB_ENV
      
      - name: Build with version info
        run: |
          echo "Building version: ${{ env.VERSION }}"
          echo "Date stamped version: ${{ env.DATED_VERSION }}"
          echo "Deploy ID: ${{ env.DEPLOY_ID }}"
          
          # 環境変数としてバージョン情報を渡す
          REACT_APP_VERSION="${{ env.VERSION }}" npm run build
```

### Node.js スクリプトでの活用 

```javascript
// デプロイ履歴の記録
const fs = require('fs');
const { getVersionAsync } = require('@yousan/show-version');

async function recordDeployment() {
  // 標準バージョン
  const version = await getVersionAsync();
  
  // 日時付きバージョン（フォーマットをカスタマイズ）
  const datedVersion = await getVersionAsync({
    format: '{tag}-{datetime}',
    datetimeFormat: 'ISO'
  });
  
  // コミットハッシュのみ
  const commitHash = await getVersionAsync({
    format: '{hash}',
    tag: false,
    branchName: false
  });
  
  // 変更有無の確認
  const { hasChangesAsync } = require('@yousan/show-version');
  const isDirty = await hasChangesAsync();
  
  // デプロイ記録
  const record = {
    version,
    datedVersion,
    commitHash,
    isDirty,
    timestamp: new Date().toISOString()
  };
  
  // JSONとして保存
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