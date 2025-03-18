const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// show-versionパッケージをインストールして使用する代わりに、自分自身のコードを使用
const { getVersionAsync } = require('../src/index');

async function updateBadge() {
  try {
    // バージョン情報を取得
    const version = await getVersionAsync({
      format: '{tag}-{branch}-{hash}'
    });
    
    // タグのみのバージョン（semver用）
    const tagVersion = await getVersionAsync({
      branchName: false,
      commitHash: false,
      format: '{tag}'
    });
    
    // 変更があるか確認
    const isDirty = await getVersionAsync({
      dir: '.',
      format: '{dirty}',
      dirtyValue: 'true',
      cleanValue: 'false'
    });
    
    // バッジ用のURLを作成
    const badgeColor = isDirty === 'true' ? 'orange' : 'blue';
    const badgeVersion = isDirty === 'true' ? `${version}-dirty` : version;
    const badgeUrl = `https://img.shields.io/badge/version-${encodeURIComponent(badgeVersion)}-${badgeColor}.svg`;
    
    // READMEファイルを読み込む
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // バッジ部分を作成
    const badgeContent = `<!-- BEGIN VERSION BADGE -->
[![Version](${badgeUrl})](https://github.com/yousan/show-version/releases/tag/${tagVersion === '0.0.0' ? 'latest' : tagVersion})
[![SemVer](https://img.shields.io/badge/SemVer-${tagVersion}-brightgreen.svg)](https://semver.org/)
<!-- END VERSION BADGE -->`;
    
    // バッジ部分を置換
    const newReadmeContent = readmeContent.replace(
      /<!-- BEGIN VERSION BADGE -->[\s\S]*?<!-- END VERSION BADGE -->/,
      badgeContent
    );
    
    // ファイルが変更された場合のみ書き込み
    if (newReadmeContent !== readmeContent) {
      console.log('Updating README with new version badge:', badgeVersion);
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