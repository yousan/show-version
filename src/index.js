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
  
  try {
    // ブランチ名を取得
    if (branchName) {
      try {
        const branch = await git.currentBranch({
          fs,
          dir,
          fullname: false
        });
        version = version.replace('{branch}', branch || 'unknown');
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
      try {
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
        
        version = version.replace('{tag}', latestTag);
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
 * Gitリポジトリからバージョン情報を取得する（同期版）
 * 内部では非同期処理を行いますが、同期的に結果を返すようラップします
 * @param {Object} options - オプション
 * @returns {string} バージョン情報
 */
function getVersion(options = {}) {
  // 同期処理で結果を取得するためのワークアラウンド
  // 警告: これは本番環境では推奨されない方法です
  let result = 'unknown';
  
  // 非同期関数を即時実行して結果を取得
  (async () => {
    try {
      result = await getVersionAsync(options);
    } catch (err) {
      console.error('バージョン取得エラー:', err);
    }
  })();
  
  // 同期的に結果を取得するため、一時的にブロック
  const waitUntil = Date.now() + 1000; // 最大1秒待機
  while (result === 'unknown' && Date.now() < waitUntil) {
    // ビジーウェイト（非推奨だが、同期APIのためのワークアラウンド）
  }
  
  return result;
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
  // 同期処理で結果を取得するためのワークアラウンド
  let result = false;
  
  // 非同期関数を即時実行して結果を取得
  (async () => {
    try {
      result = await hasChangesAsync(dir);
    } catch (err) {
      console.error('変更確認エラー:', err);
    }
  })();
  
  // 同期的に結果を取得するため、一時的にブロック
  const waitUntil = Date.now() + 1000; // 最大1秒待機
  while (Date.now() < waitUntil) {
    // ビジーウェイト（非推奨だが、同期APIのためのワークアラウンド）
    if (typeof result === 'boolean') break;
  }
  
  return result;
}

module.exports = {
  getVersion,
  getVersionAsync,
  hasChanges,
  hasChangesAsync
}; 