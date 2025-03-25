#!/usr/bin/env node

const { getVersionAsync, hasChangesAsync } = require('../src/index');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('format', {
    alias: 'f',
    type: 'string',
    default: '{tag}-{branch}-{hash}',
    description: 'Version information format ({tag}, {branch}, {hash}, {datetime})',
  })
  .option('no-tag', {
    type: 'boolean',
    default: false,
    description: 'Exclude tag information',
  })
  .option('no-branch', {
    type: 'boolean',
    default: false,
    description: 'Exclude branch name',
  })
  .option('no-hash', {
    type: 'boolean',
    default: false,
    description: 'Exclude commit hash',
  })
  .option('no-datetime', {
    type: 'boolean',
    default: false,
    description: 'Exclude datetime information',
  })
  .option('datetime-format', {
    type: 'string',
    default: 'ISO',
    description: 'Datetime format (ISO, YYYYMMDDHHmmss, YYYYMMDD)',
  })
  .option('dir', {
    type: 'string',
    default: '.',
  })
  .option('dirty', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: 'Flag to display when there are uncommitted changes',
  })
  .option('dirty-suffix', {
    type: 'string',
    default: '-dirty',
    description: 'String to append when there are uncommitted changes',
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

// Main processing (asynchronous)
async function main() {
  try {
    const options = {
      format: argv.format,
      tag: !argv.noTag,
      branchName: !argv.noBranch,
      commitHash: !argv.noHash,
      datetime: !argv.noDatetime,
      datetimeFormat: argv.datetimeFormat,
      dir: argv.dir
    };
    
    // Get version information
    let version = await getVersionAsync(options);
    
    // If there are uncommitted changes and the dirty option is enabled
    if (argv.dirty && await hasChangesAsync(argv.dir)) {
      version += argv.dirtySuffix;
    }
    
    // Display version information to standard output
    console.log(version);
    
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Execute the asynchronous main function
main(); 