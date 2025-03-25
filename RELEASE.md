# Release Process

This is the release process following GitFlow. Release operations are performed manually, with CI only automating badge and README updates.

## 1. Create Release Branch

```bash
# Get latest changes from develop branch
git checkout develop
git pull origin develop

# Create release branch (vX.Y.Z is the version number)
git checkout -b release/vX.Y.Z

# Update version in package.json
# Either edit package.json manually or use the following command:
npm version X.Y.Z --no-git-tag-version
```

## 2. Release Preparation Work

```bash
# Update README version information
./bin/update_myself.sh

# Perform necessary tests and corrections
npm test

# Commit changes
git add package.json README.md
git commit -m "Release vX.Y.Z"

# Push release branch
git push origin release/vX.Y.Z
```

## 3. Release Completion

```bash
# Merge to main branch
git checkout main
git pull origin main
git merge --no-ff release/vX.Y.Z -m "Merge branch 'release/vX.Y.Z'"

# Create tag
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# Merge to develop branch
git checkout develop
git pull origin develop
git merge --no-ff release/vX.Y.Z -m "Merge branch 'release/vX.Y.Z'"

# Push changes
git push origin main
git push origin develop
git push origin --tags

# Delete release branch (optional)
git branch -d release/vX.Y.Z
git push origin --delete release/vX.Y.Z
```

## 4. npm Publish (if necessary)

```bash
# Perform on main branch
git checkout main
npm publish
```

## Notes

- When tags are pushed, GitHub Actions automatically updates the README badge
- Release operations should be performed by a single person, not distributed
- It is recommended to create a PR for releases containing significant changes 