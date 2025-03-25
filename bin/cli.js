#!/usr/bin/env node

const { getVersionAsync, hasChangesAsync } = require('../src/index');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// コマンドライン引数の解析
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('format', {
    alias: 'f',
    type: 'string',
    description: 'バージョン情報のフォーマット ({tag}, {branch}, {hash}, {datetime})',
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
  .option('no-datetime', {
    type: 'boolean',
    description: '日時情報を含めない',
    default: false
  })
  .option('datetime-format', {
    type: 'string',
    description: '日時のフォーマット (ISO, YYYYMMDDHHmmss, YYYYMMDD)',
    default: 'ISO',
    choices: ['ISO', 'YYYYMMDDHHmmss', 'YYYYMMDD']
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
  .option('dir', {
    type: 'string',
    description: 'Gitリポジトリのディレクトリパス',
    default: '.'
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

// メイン処理（非同期）
async function main() {
  try {
    const options = {
      format: argv.format,
      tag: !argv.noTag,
      branchName: !argv.noBranch,
      commitHash: !argv.noHash,
      datetime: !argv.noDatetime,
      datetimeFormat: argv.datetimeFormat,
      dir: argv.dir
    };
    
    // バージョン情報を取得
    let version = await getVersionAsync(options);
    
    // 未コミットの変更があり、dirtyオプションが有効な場合
    if (argv.dirty && await hasChangesAsync(argv.dir)) {
      version += argv.dirtySuffix;
    }
    
    // バージョン情報を標準出力に表示
    console.log(version);
    
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// 非同期メイン関数を実行
main(); 