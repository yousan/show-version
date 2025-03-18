/**
 * CI/CD Integration Example for show-version
 * 
 * This example demonstrates how to use show-version in CI/CD pipelines
 * to generate version identifiers for builds.
 */

const { getVersionAsync } = require('../src/index');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate a version file to be included in the build
 */
async function generateVersionFile(outputPath = 'build-version.json') {
  try {
    // Get the current timestamp
    const buildTimestamp = new Date().toISOString();
    
    // Get version info with all details
    const fullVersion = await getVersionAsync({
      format: '{tag}-{branch}-{hash}'
    });
    
    // Get only tag for semantic versioning
    const semverVersion = await getVersionAsync({
      branchName: false,
      commitHash: false,
      format: '{tag}'
    });
    
    // Check if there are uncommitted changes
    const isDirty = await getVersionAsync({
      format: '{dirty}',
      dirtyValue: 'true',
      cleanValue: 'false'
    });
    
    // Create a version object
    const versionInfo = {
      version: fullVersion,
      semver: semverVersion,
      build: {
        timestamp: buildTimestamp,
        number: process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || 'local',
        dirty: isDirty === 'true'
      },
      git: {
        commit: await getVersionAsync({ format: '{hash}', tag: false, branchName: false }),
        branch: await getVersionAsync({ format: '{branch}', tag: false, commitHash: false }),
        tag: await getVersionAsync({ format: '{tag}', branchName: false, commitHash: false })
      }
    };
    
    // Write the version info to a JSON file
    await fs.writeFile(
      outputPath,
      JSON.stringify(versionInfo, null, 2),
      'utf8'
    );
    
    console.log(`Version file generated at: ${outputPath}`);
    console.log('Version info:', versionInfo);
    
    return versionInfo;
  } catch (error) {
    console.error('Error generating version file:', error);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  // Use the first argument as the output path, or default to build-version.json
  const outputPath = process.argv[2] || 'build-version.json';
  
  generateVersionFile(outputPath).catch(error => {
    console.error('Failed to generate version file:', error);
    process.exit(1);
  });
}

module.exports = { generateVersionFile }; 