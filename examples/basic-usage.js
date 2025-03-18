/**
 * Basic Usage Examples for show-version
 * 
 * Run this example with:
 *   node examples/basic-usage.js
 */

const { getVersion, getVersionAsync, hasChanges, hasChangesAsync } = require('../src/index');

// Example 1: Basic synchronous usage
console.log('Example 1: Basic synchronous usage');
const version = getVersion();
console.log('Current version:', version);
console.log('Has uncommitted changes:', hasChanges());
console.log('-------------------------------------------');

// Example 2: Customizing output format
console.log('Example 2: Customizing output format');
const customVersion = getVersion({
  format: '{tag}+{hash}'
});
console.log('Custom format version:', customVersion);
console.log('-------------------------------------------');

// Example 3: Using async API (recommended)
async function asyncExample() {
  console.log('Example 3: Using async API (recommended)');
  
  const asyncVersion = await getVersionAsync();
  console.log('Async current version:', asyncVersion);
  
  const customAsyncVersion = await getVersionAsync({
    format: '🏷️ {tag} | 🔀 {branch} | 📝 {hash}',
    dir: '.'
  });
  console.log('Fancy version string:', customAsyncVersion);
  
  const hasUncommittedChanges = await hasChangesAsync();
  console.log('Repository has changes:', hasUncommittedChanges);
  console.log('-------------------------------------------');
}

// Example 4: Filtering components
async function filteringExample() {
  console.log('Example 4: Filtering components');
  
  const tagOnly = await getVersionAsync({
    branchName: false,
    commitHash: false
  });
  console.log('Tag only:', tagOnly);
  
  const hashOnly = await getVersionAsync({
    tag: false,
    branchName: false,
    format: '{hash}'
  });
  console.log('Hash only:', hashOnly);
  console.log('-------------------------------------------');
}

// Run async examples
(async () => {
  try {
    await asyncExample();
    await filteringExample();
    
    console.log('All examples completed successfully.');
  } catch (error) {
    console.error('Error running examples:', error);
  }
})(); 