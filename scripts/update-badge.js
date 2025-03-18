const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// show-versionパッケージをインストールして使用する代わりに、自分自身のコードを使用
const { getVersionAsync, hasChangesAsync } = require('../src/index');

// package.jsonからバージョン情報を読み込む
function getPackageVersion() {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version || '0.0.0';
  } catch (error) {
    console.error('Error reading package.json:', error);
    return '0.0.0';
  }
}

async function updateBadge() {
  try {
    // package.jsonからのバージョン
    const packageVersion = getPackageVersion();
    
    // Gitからバージョン情報を取得
    const gitVersion = await getVersionAsync({
      format: '{tag}'
    });
    
    // ブランチ名を取得
    const branch = await getVersionAsync({
      tag: false,
      commitHash: false,
      format: '{branch}'
    });
    
    // コミットハッシュを取得
    const commitHash = await getVersionAsync({
      tag: false,
      branchName: false,
      format: '{hash}'
    });
    
    // 変更があるか確認
    const isDirty = await hasChangesAsync();
    
    // 表示用のバージョン情報を作成
    const displayVersion = packageVersion;
    const gitInfo = `${branch}@${commitHash}${isDirty ? ' (dirty)' : ''}`;
    
    // バッジ用のURLを作成（適切にURLエンコード）
    const encodedVersion = encodeURIComponent(displayVersion);
    const encodedGitInfo = encodeURIComponent(gitInfo);
    
    const versionBadgeUrl = `https://img.shields.io/badge/version-${encodedVersion}-blue.svg`;
    const gitBadgeUrl = `https://img.shields.io/badge/git-${encodedGitInfo}-${isDirty ? 'orange' : 'green'}.svg`;
    
    // READMEファイルを読み込む
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // バッジ部分を作成
    const badgeContent = `<!-- BEGIN VERSION BADGE -->
[![Version](${versionBadgeUrl})](https://github.com/yousan/show-version/releases/tag/v${displayVersion})
[![Git](${gitBadgeUrl})](https://github.com/yousan/show-version/commit/${commitHash})
<!-- END VERSION BADGE -->`;
    
    // バッジ部分を置換
    const newReadmeContent = readmeContent.replace(
      /<!-- BEGIN VERSION BADGE -->[\s\S]*?<!-- END VERSION BADGE -->/,
      badgeContent
    );
    
    // ファイルが変更された場合のみ書き込み
    if (newReadmeContent !== readmeContent) {
      console.log('Updating README with new version badge:', displayVersion, gitInfo);
      fs.writeFileSync(readmePath, newReadmeContent, 'utf8');
      return true;
    } else {
      console.log('No changes to README needed');
      return false;
    }
  } catch (error) {
    console.error('Error updating version badge:', error);
    return false;
  }
}

// スクリプト実行
updateBadge().then(changed => {
  process.exit(changed ? 0 : 1);
}); 