const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

/**
 * Gitリポジトリからバージョン情報を取得する（非同期）
 * @param {Object} options - オプション
 * @param {boolean} options.commitHash - コミットハッシュを含めるかどうか
 * @param {boolean} options.branchName - ブランチ名を含めるかどうか
 * @param {boolean} options.tag - タグ情報を含めるかどうか
 * @param {string} options.format - 出力フォーマット
 * @param {string} options.dir - Gitリポジトリのディレクトリパス
 * @returns {Promise<string>} バージョン情報
 */
async function getVersionAsync(options = {}) {
  const {
    commitHash = true,
    branchName = true,
    tag = true,
    format = '{tag}-{branch}-{hash}',
    dir = '.'
  } = options;
  
  let version = format;
  let currentBranch = 'unknown';
  
  try {
    // ブランチ名を取得
    if (branchName) {
      try {
        const branch = await git.currentBranch({
          fs,
          dir,
          fullname: false
        });
        currentBranch = branch || 'unknown';
        version = version.replace('{branch}', currentBranch);
      } catch (e) {
        version = version.replace('{branch}', 'unknown');
      }
    } else {
      version = version.replace('{branch}', '');
    }
    
    // コミットハッシュを取得
    if (commitHash) {
      try {
        const commitSha = await git.resolveRef({
          fs,
          dir,
          ref: 'HEAD'
        });
        const hash = commitSha.slice(0, 7); // 短いハッシュ（7文字）
        version = version.replace('{hash}', hash);
      } catch (e) {
        version = version.replace('{hash}', 'unknown');
      }
    } else {
      version = version.replace('{hash}', '');
    }
    
    // タグ情報を取得
    if (tag) {
      let tagVersion = '0.0.0';
      
      try {
        // リリースブランチからバージョン情報を取得
        // 例: release/v1.2.3 → 1.2.3
        if (currentBranch.startsWith('release/')) {
          // リリースブランチからバージョン文字列を抽出
          const releaseVersion = currentBranch.substring('release/'.length)
                                            .replace(/^v/, ''); // 先頭の 'v' があれば削除
          
          if (releaseVersion && /^\d+\.\d+\.\d+/.test(releaseVersion)) {
            // セマンティックバージョンの形式であれば、そのバージョンを使用
            tagVersion = releaseVersion;
          } else {
            // 形式が異なる場合は通常のタグ取得処理
            tagVersion = await getLatestTag();
          }
        } else {
          // リリースブランチでない場合は通常のタグ取得処理
          tagVersion = await getLatestTag();
        }
        
        version = version.replace('{tag}', tagVersion);
      } catch (e) {
        version = version.replace('{tag}', '0.0.0');
      }
    } else {
      version = version.replace('{tag}', '');
    }
    
    // フォーマットを整理（余計なハイフン等を削除）
    version = version.replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    return version;
  } catch (error) {
    console.error('バージョン情報の取得に失敗しました:', error);
    return 'unknown';
  }
}

/**
 * 最新のタグを取得する内部関数
 * @param {string} dir - Gitリポジトリのディレクトリパス
 * @returns {Promise<string>} 最新のタグ（なければ'0.0.0'）
 */
async function getLatestTag(dir = '.') {
  const tags = await git.listTags({ fs, dir });
  
  // タグがあれば最新のものを取得（セマンティックバージョンでソート）
  let latestTag = '0.0.0';
  if (tags.length > 0) {
    // タグを取得できた場合、セマンティックバージョンとして並べ替え
    tags.sort((a, b) => {
      // semverではないタグも扱えるように簡易的な比較を実装
      const aParts = a.split('.').map(p => parseInt(p.replace(/[^0-9]/g, '')) || 0);
      const bParts = b.split('.').map(p => parseInt(p.replace(/[^0-9]/g, '')) || 0);
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) {
          return aVal - bVal;
        }
      }
      return 0;
    });
    
    latestTag = tags[tags.length - 1];
  }
  
  return latestTag;
}

/**
 * Gitリポジトリからバージョン情報を取得する（同期版）
 * 内部では非同期処理を行いますが、同期的に結果を返すようラップします
 * @param {Object} options - オプション
 * @returns {string} バージョン情報
 */
function getVersion(options = {}) {
  // 警告: これは本番環境では推奨されない方法です
  try {
    // 同期的にPromiseを実行するためのハック
    const { execSync } = require('child_process');
    
    // 一時スクリプトを実行して同期的に結果を取得
    const scriptContent = `
      const { getVersionAsync } = require('${__filename}');
      async function run() {
        try {
          const result = await getVersionAsync(${JSON.stringify(options)});
          console.log(result);
        } catch (err) {
          console.error(err);
          console.log('unknown');
        }
      }
      run();
    `;
    
    // 一時スクリプトを同期的に実行して結果を取得
    const result = execSync(`node -e "${scriptContent.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8'
    }).trim();
    
    return result;
  } catch (error) {
    console.error('バージョン取得エラー:', error);
    return 'unknown';
  }
}

/**
 * 現在のGitリポジトリの状態から変更があるかどうかを確認する（非同期）
 * @param {string} dir - Gitリポジトリのディレクトリパス
 * @returns {Promise<boolean>} 変更があればtrue、なければfalse
 */
async function hasChangesAsync(dir = '.') {
  try {
    const statusMatrix = await git.statusMatrix({
      fs,
      dir
    });
    
    // 変更があるかどうかチェック（ステージングされていないファイルを含む）
    return statusMatrix.some(row => row[2] !== row[1]);
  } catch (error) {
    console.error('リポジトリ状態の確認に失敗しました:', error);
    return false;
  }
}

/**
 * 現在のGitリポジトリの状態から変更があるかどうかを確認する（同期版）
 * @param {string} dir - Gitリポジトリのディレクトリパス
 * @returns {boolean} 変更があればtrue、なければfalse
 */
function hasChanges(dir = '.') {
  try {
    // 同期的にPromiseを実行するためのハック
    const { execSync } = require('child_process');
    
    // 一時スクリプトを実行して同期的に結果を取得
    const scriptContent = `
      const { hasChangesAsync } = require('${__filename}');
      async function run() {
        try {
          const result = await hasChangesAsync(${JSON.stringify(dir)});
          console.log(result);
        } catch (err) {
          console.error(err);
          console.log('false');
        }
      }
      run();
    `;
    
    // 一時スクリプトを同期的に実行して結果を取得
    const resultStr = execSync(`node -e "${scriptContent.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8'
    }).trim();
    
    return resultStr === 'true';
  } catch (error) {
    console.error('変更確認エラー:', error);
    return false;
  }
}

module.exports = {
  getVersion,
  getVersionAsync,
  hasChanges,
  hasChangesAsync
}; 