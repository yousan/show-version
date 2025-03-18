const { execSync } = require('child_process');

/**
 * Gitリポジトリからバージョン情報を取得する
 * @param {Object} options - オプション
 * @param {boolean} options.commitHash - コミットハッシュを含めるかどうか
 * @param {boolean} options.branchName - ブランチ名を含めるかどうか
 * @param {boolean} options.tag - タグ情報を含めるかどうか
 * @param {string} options.format - 出力フォーマット
 * @returns {string} バージョン情報
 */
function getVersion(options = {}) {
  const {
    commitHash = true,
    branchName = true,
    tag = true,
    format = '{tag}-{branch}-{hash}'
  } = options;
  
  let version = format;
  
  try {
    // ブランチ名を取得
    let branch = '';
    if (branchName) {
      try {
        branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      } catch (e) {
        branch = 'unknown';
      }
      version = version.replace('{branch}', branch);
    } else {
      version = version.replace('{branch}', '');
    }
    
    // コミットハッシュを取得
    let hash = '';
    if (commitHash) {
      try {
        hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      } catch (e) {
        hash = 'unknown';
      }
      version = version.replace('{hash}', hash);
    } else {
      version = version.replace('{hash}', '');
    }
    
    // タグ情報を取得
    let tagInfo = '';
    if (tag) {
      try {
        // 最新のタグを取得（なければempty）
        tagInfo = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
        // タグがない場合は0.0.0に
        if (!tagInfo) {
          tagInfo = '0.0.0';
        }
      } catch (e) {
        tagInfo = '0.0.0';
      }
      version = version.replace('{tag}', tagInfo);
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
 * 現在のGitリポジトリの状態から変更があるかどうかを確認する
 * @returns {boolean} 変更があればtrue、なければfalse
 */
function hasChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length > 0;
  } catch (error) {
    return false;
  }
}

module.exports = {
  getVersion,
  hasChanges
}; 