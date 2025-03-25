# リリース手順

GitFlowに従ったリリース手順です。リリース作業は手動で行い、バッジとREADMEの更新のみをCIが自動化します。

## 1. リリースブランチの作成

```bash
# developブランチから最新の変更を取得
git checkout develop
git pull origin develop

# リリースブランチを作成（vX.Y.Zはバージョン番号）
git checkout -b release/vX.Y.Z

# package.jsonのバージョンを更新
# package.jsonを編集するか、以下のコマンドを使用：
npm version X.Y.Z --no-git-tag-version
```

## 2. リリース準備作業

```bash
# READMEのバージョン情報を更新
./bin/update_myself.sh

# 必要なテストや修正を実施
npm test

# 変更をコミット
git add package.json README.md
git commit -m "Release vX.Y.Z"

# リリースブランチをプッシュ
git push origin release/vX.Y.Z
```

## 3. リリース完了

```bash
# mainブランチへのマージ
git checkout main
git pull origin main
git merge --no-ff release/vX.Y.Z -m "Merge branch 'release/vX.Y.Z'"

# タグの作成
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# developブランチへのマージ
git checkout develop
git pull origin develop
git merge --no-ff release/vX.Y.Z -m "Merge branch 'release/vX.Y.Z'"

# 変更をプッシュ
git push origin main
git push origin develop
git push origin --tags

# リリースブランチを削除（オプション）
git branch -d release/vX.Y.Z
git push origin --delete release/vX.Y.Z
```

## 4. npm公開（必要な場合）

```bash
# mainブランチで実行
git checkout main
npm publish
```

## 注意事項

- タグがプッシュされると、GitHub Actionsが自動的にREADMEのバッジを更新します
- リリース作業は一人の担当者が一貫して行い、途中で作業を分散させないでください
- 大きな変更を含むリリースは、PRを作成してレビューを依頼することを推奨します 