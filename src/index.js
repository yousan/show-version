const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

/**
 * Get version information from Git repository (asynchronous)
 * @param {Object} options - Options
 * @param {boolean} options.commitHash - Whether to include commit hash
 * @param {boolean} options.branchName - Whether to include branch name
 * @param {boolean} options.tag - Whether to include tag information
 * @param {boolean} options.datetime - Whether to include datetime information
 * @param {string} options.datetimeFormat - Datetime format ('ISO' or 'YYYYMMDDHHmmss')
 * @param {string} options.format - Output format
 * @param {string} options.dir - Git repository directory path
 * @returns {Promise<string>} Version information
 */
async function getVersionAsync(options = {}) {
  const {
    commitHash = true,
    branchName = true,
    tag = true,
    datetime = true,
    datetimeFormat = 'ISO',
    format = '{tag}-{branch}-{hash}',
    dir = '.'
  } = options;
  
  let version = format;
  let currentBranch = 'unknown';
  
  try {
    // Get branch name
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
    
    // Get commit hash
    if (commitHash) {
      try {
        const commitSha = await git.resolveRef({
          fs,
          dir,
          ref: 'HEAD'
        });
        const hash = commitSha.slice(0, 7); // Short hash (7 characters)
        version = version.replace('{hash}', hash);
      } catch (e) {
        version = version.replace('{hash}', 'unknown');
      }
    } else {
      version = version.replace('{hash}', '');
    }
    
    // Get tag information
    if (tag) {
      let tagVersion = '0.0.0';
      
      try {
        // Get version information from release branch
        // Example: release/v1.2.3 → 1.2.3
        if (currentBranch.startsWith('release/')) {
          // Extract version string from release branch
          const releaseVersion = currentBranch.substring('release/'.length)
                                            .replace(/^v/, ''); // Remove 'v' if it exists
          
          if (releaseVersion && /^\d+\.\d+\.\d+/.test(releaseVersion)) {
            // If it's in semantic version format, use that version
            tagVersion = releaseVersion;
          } else {
            // If format is different, use regular tag retrieval process
            tagVersion = await getLatestTag();
          }
        } else {
          // If not a release branch, use regular tag retrieval process
          tagVersion = await getLatestTag();
        }
        
        version = version.replace('{tag}', tagVersion);
      } catch (e) {
        version = version.replace('{tag}', '0.0.0');
      }
    } else {
      version = version.replace('{tag}', '');
    }
    
    // Add datetime information
    if (datetime && version.includes('{datetime}')) {
      const now = new Date();
      let dateTimeStr;
      
      // Generate datetime string based on format
      if (datetimeFormat === 'ISO') {
        // ISO format: YYYY-MM-DDTHH:mm:ss
        dateTimeStr = now.toISOString().replace(/\.\d+Z$/, '');
      } else if (datetimeFormat === 'YYYYMMDDHHmmss') {
        // Continuous format: YYYYMMDDHHmmss
        const pad = (num) => String(num).padStart(2, '0');
        dateTimeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      } else {
        // Default format: YYYYMMDD
        const pad = (num) => String(num).padStart(2, '0');
        dateTimeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
      }
      
      version = version.replace('{datetime}', dateTimeStr);
    }
    
    // Clean up format (remove extra hyphens etc.)
    version = version.replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    return version;
  } catch (error) {
    console.error('Failed to get version information:', error);
    return 'unknown';
  }
}

/**
 * Get latest tag
 * @param {string} dir - Git repository directory path
 * @returns {Promise<string>} Latest tag (if none, '0.0.0')
 */
async function getLatestTag(dir = '.') {
  const tags = await git.listTags({ fs, dir });
  
  // If there are tags, get the latest one
  let latestTag = '0.0.0';
  if (tags.length > 0) {
    // If tags are retrieved, sort them as semantic versions
    tags.sort((a, b) => {
      // Implement simple comparison for tags that are not semver
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
 * Get version information from Git repository (synchronous)
 * Internally performs asynchronous processing but wraps the result in a synchronous manner
 * @param {Object} options - Options
 * @returns {string} Version information
 */
function getVersion(options = {}) {
  // Warning: This is not recommended for production environments
  try {
    // Hack to execute Promise synchronously
    const { execSync } = require('child_process');
    
    // Execute temporary script to get synchronous result
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
    
    // Execute temporary script synchronously to get result
    const result = execSync(`node -e "${scriptContent.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8'
    }).trim();
    
    return result;
  } catch (error) {
    console.error('Version retrieval error:', error);
    return 'unknown';
  }
}

/**
 * Check if there are changes in the current Git repository (asynchronous)
 * @param {string} dir - Git repository directory path
 * @returns {Promise<boolean>} true if there are changes, false if not
 */
async function hasChangesAsync(dir = '.') {
  try {
    const statusMatrix = await git.statusMatrix({
      fs,
      dir
    });
    
    // Check if there are changes (including unstaged files)
    return statusMatrix.some(row => row[2] !== row[1]);
  } catch (error) {
    console.error('Failed to check repository status:', error);
    return false;
  }
}

/**
 * Check if there are changes in the current Git repository (synchronous)
 * @param {string} dir - Git repository directory path
 * @returns {boolean} true if there are changes, false if not
 */
function hasChanges(dir = '.') {
  try {
    // Hack to execute Promise synchronously
    const { execSync } = require('child_process');
    
    // Execute temporary script to get synchronous result
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
    
    // Execute temporary script synchronously to get result
    const resultStr = execSync(`node -e "${scriptContent.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8'
    }).trim();
    
    return resultStr === 'true';
  } catch (error) {
    console.error('Change check error:', error);
    return false;
  }
}

// v1.2.1 for dummy update: Ticket #123 support
// GitHub Actions npm publishing feature test

// v1.3.0 for improvement:
// - Improved error message
// - Increased debug information
// - Increased stability
// - Added datetime information: {datetime} format support

// v1.4.0 for improvement:
// - Added datetime placeholder {datetime}
// - Added multiple datetime format options (ISO, YYYYMMDDHHmmss, YYYYMMDD)
// - Extended command line options (--datetime-format, --no-datetime)
// - Expanded documentation and samples

module.exports = {
  getVersion,
  getVersionAsync,
  hasChanges,
  hasChangesAsync
}; 