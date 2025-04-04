#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("../index");
commander_1.program
    .version(index_1.version)
    .description('Display version information from package.json')
    .parse(process.argv);
