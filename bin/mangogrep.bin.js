#!/usr/bin/env node

// command-line args
const args = require('yargs')
  .option('selector', { alias: 's', type: 'string', describe: 'Mango selector' })
  .option('where', { alias: 'w', type: 'string', describe: 'SQL where clauser' })
  .option('debug', { alias: 'd', type: 'boolean', describe: 'Output selector to stderr' })
  .help('help')
  .argv

// start the snapshot
const mangogrep = require('../index.js')
mangogrep.start(args).catch((e) => { console.error(e.toString())})
