#!/usr/bin/env node

import { program } from 'commander';
import { version } from '../index';

program
  .version(version)
  .description('Display version information from package.json')
  .parse(process.argv); 