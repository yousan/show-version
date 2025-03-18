# show-version

GitリポジトリからバージョンID（タグ、ブランチ名、コミットハッシュなど）を抽出するシンプルなユーティリティです。

## インストール

### グローバルインストール

```bash
npm install -g show-version
```

### プロジェクト内での使用

```bash
npm install --save show-version
```

## 使い方

### CLIツールとして

```bash
# デフォルト出力（タグ-ブランチ-ハッシュ）
show-version

# フォーマット指定
show-version --format "{tag}-{hash}"

# タグ情報を除外
show-version --no-tag

# 未コミットの変更がある場合に-dirtyを追加
show-version --dirty

# ヘルプを表示
show-version --help
```

### Node.jsコード内での使用

```javascript
const { getVersion, hasChanges } = require('show-version');

// デフォルトオプションでバージョンを取得
const version = getVersion();
console.log('現在のバージョン:', version);

// カスタムオプションを指定
const customVersion = getVersion({
  format: '{tag}+{hash}',
  branchName: false  // ブランチ名を含めない
});
console.log('カスタムバージョン:', customVersion);

// 変更があるか確認
if (hasChanges()) {
  console.log('未コミットの変更があります');
}
```

## オプション

### CLIオプション

| オプション      | 説明                                   | デフォルト値               |
| -------------- | ------------------------------------- | ------------------------- |
| --format, -f   | 出力フォーマット                         | {tag}-{branch}-{hash}    |
| --no-tag       | タグ情報を含めない                       | false                     |
| --no-branch    | ブランチ名を含めない                     | false                     |
| --no-hash      | コミットハッシュを含めない                | false                     |
| --dirty, -d    | 未コミットの変更がある場合にフラグを追加    | false                     |
| --dirty-suffix | 未コミット変更時に追加する文字列           | -dirty                   |

### APIオプション

```javascript
getVersion({
  format: '{tag}-{branch}-{hash}', // 出力フォーマット
  tag: true,                       // タグ情報を含める
  branchName: true,                // ブランチ名を含める
  commitHash: true                 // コミットハッシュを含める
});
```

## ライセンス

MIT 