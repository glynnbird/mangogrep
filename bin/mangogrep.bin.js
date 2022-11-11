#!/usr/bin/env node
const egSelector = '{"name":"Bob","date":{"$gt":"2022-01-01"}}'
const egSQL = "name='Bob' AND date > '2022-01-01'" 
// command-line args
const args = require('yargs')
  .option('selector', { alias: 's', type: 'string', describe: `Mango selector e.g ${egSelector}` })
  .option('where', { alias: 'w', type: 'string', describe: `SQL where clause e.g. ${egSQL}` })
  .option('debug', { alias: 'd', type: 'boolean', describe: 'Output selector to stderr' })
  .help('help')
  .argv

// start the snapshot
const mangogrep = require('../index.js')
mangogrep.start(args).catch((e) => { console.error(e.toString())})
