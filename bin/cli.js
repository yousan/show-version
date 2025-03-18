#!/usr/bin/env node

const { getVersion, hasChanges } = require('../src/index');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('format', {
    alias: 'f',
    type: 'string',
    description: 'バージョン情報のフォーマット ({tag}, {branch}, {hash})',
    default: '{tag}-{branch}-{hash}'
  })
  .option('no-tag', {
    type: 'boolean',
    description: 'タグ情報を含めない',
    default: false
  })
  .option('no-branch', {
    type: 'boolean',
    description: 'ブランチ名を含めない',
    default: false
  })
  .option('no-hash', {
    type: 'boolean',
    description: 'コミットハッシュを含めない',
    default: false
  })
  .option('dirty', {
    alias: 'd',
    type: 'boolean',
    description: '未コミットの変更がある場合に表示するフラグ',
    default: false
  })
  .option('dirty-suffix', {
    type: 'string',
    description: '未コミットの変更がある場合に追加する文字列',
    default: '-dirty'
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

const options = {
  format: argv.format,
  tag: !argv.noTag,
  branchName: !argv.noBranch,
  commitHash: !argv.noHash
};

let version = getVersion(options);

// 未コミットの変更があり、dirtyオプションが有効な場合
if (argv.dirty && hasChanges()) {
  version += argv.dirtySuffix;
}

// バージョン情報を標準出力に表示
console.log(version); 