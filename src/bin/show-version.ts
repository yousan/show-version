#!/usr/bin/env node

import { program } from 'commander';
import { getVersion } from '../index';

async function main() {
  const version = await getVersion();
  program
    .version(version)
    .description('Display version information from package.json')
    .parse(process.argv);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 