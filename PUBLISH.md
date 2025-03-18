# Publishing Guide

This document describes how to publish this package to npm.

## Preparation

1. If you don't have an npm account, create one on the [official npm website](https://www.npmjs.com/).

2. Log in to npm from the command line:
   ```bash
   npm login
   ```

3. Verify that the information in `package.json` is correct:
   - name: Package name
   - version: Version number
   - description: Description
   - author: Author information
   - license: License information

## Publishing

To publish the package:

```bash
npm publish
```

## Version Updates

1. After making changes to the package, update the version:
   ```bash
   # Update patch version (1.0.0 → 1.0.1)
   npm version patch
   
   # Update minor version (1.0.0 → 1.1.0)
   npm version minor
   
   # Update major version (1.0.0 → 2.0.0)
   npm version major
   ```

2. Commit the changes to Git:
   ```bash
   git push --follow-tags
   ```

3. Publish the new version:
   ```bash
   npm publish
   ```

## Publishing as a Scoped Package

If you want to publish the package under a personal or organizational namespace:

1. Modify the `name` field in `package.json`:
   ```json
   {
     "name": "@your-username/show-version",
     ...
   }
   ```

2. Set the scoped package as public when publishing:
   ```bash
   npm publish --access public
   ``` 