#!/usr/bin/env node
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {
  ConsoleLogger,
  LogLevel,
  NodeJSFileSystem,
  setFileSystem,
} from '@angular/compiler-cli/private/localize';
import {globSync} from 'tinyglobby';
import yargs from 'yargs';
import {migrateFiles} from './index';

const args = process.argv.slice(2);
const options = yargs(args)
  .option('r', {
    alias: 'root',
    default: '.',
    describe:
      'The root path for other paths provided in these options.\n' +
      'This should either be absolute or relative to the current working directory.',
    type: 'string',
  })
  .option('f', {
    alias: 'files',
    required: true,
    describe:
      'A glob pattern indicating what files to migrate. This should be relative to the root path',
    type: 'string',
  })
  .option('m', {
    alias: 'mapFile',
    required: true,
    describe:
      'Path to the migration mapping file generated by `localize-extract`. This should be relative to the root path.',
    type: 'string',
  })
  .strict()
  .help()
  .parseSync();

const fs = new NodeJSFileSystem();
setFileSystem(fs);

const rootPath = options.r;
const translationFilePaths = globSync(options.f, {cwd: rootPath, onlyFiles: true});
const logger = new ConsoleLogger(LogLevel.warn);

migrateFiles({rootPath, translationFilePaths, mappingFilePath: options.m, logger});
process.exit(0);
