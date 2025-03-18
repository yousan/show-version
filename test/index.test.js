/**
 * Basic tests for show-version
 * 
 * To run these tests:
 * 1. Install testing dependencies: npm install --save-dev mocha chai
 * 2. Run: npx mocha test
 */

const { expect } = require('chai');

// Import the library
const { getVersion, getVersionAsync, hasChanges, hasChangesAsync } = require('../src/index');

describe('show-version', function() {
  this.timeout(5000); // Increase timeout for git operations
  
  describe('getVersion', () => {
    it('should return a string', () => {
      const version = getVersion();
      expect(version).to.be.a('string');
    });
    
    it('should accept format option', () => {
      const version = getVersion({ format: 'test-{tag}-test' });
      expect(version).to.include('test-');
    });
    
    it('should handle disabled components', () => {
      const noTag = getVersion({ tag: false, format: '{tag}-{branch}-{hash}' });
      const noBranch = getVersion({ branchName: false, format: '{tag}-{branch}-{hash}' });
      const noHash = getVersion({ commitHash: false, format: '{tag}-{branch}-{hash}' });
      
      // Check that the disabled parts are not in the output
      // This is a bit fuzzy since we're working with a real repo
      expect(noTag).to.not.include('0.0.0-');
      expect(noBranch).to.not.include('-main-');
    });
  });
  
  describe('getVersionAsync', () => {
    it('should return a promise that resolves to a string', async () => {
      const version = await getVersionAsync();
      expect(version).to.be.a('string');
    });
    
    it('should accept format option', async () => {
      const version = await getVersionAsync({ format: 'test-{tag}-test' });
      expect(version).to.include('test-');
    });
  });
  
  describe('hasChanges', () => {
    it('should return a boolean', () => {
      const result = hasChanges();
      expect(result).to.be.a('boolean');
    });
  });
  
  describe('hasChangesAsync', () => {
    it('should return a promise that resolves to a boolean', async () => {
      const result = await hasChangesAsync();
      expect(result).to.be.a('boolean');
    });
  });
}); 