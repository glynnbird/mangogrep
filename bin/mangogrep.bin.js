#!/usr/bin/env node
const egSelector = '{"name":"Bob","date":{"$gt":"2022-01-01"}}'
const egSQL = "name='Bob' AND date > '2022-01-01'" 
const syntax = 
`Syntax:
--selector/-s            Mango selector e.g. ${egSelector}
--where/-w               SQL where clause e.g. ${egSQL}
--debug                  Output selector to stderr (default: false)
--version/v              Show app version  (default: false)
`
const app = require('../package.json')
const { parseArgs } = require('node:util')
const argv = process.argv.slice(2)
const options = {
  selector: {
    type: 'string',
    short: 's'
  },
  where: {
    type: 'string',
    short: 'w'
  },
  debug: {
    type: 'boolean',
    short: 'd',
    default: false
  },
  version: {
    type: 'boolean',
    short: 'v',
    default: false
  },
  help: {
    type: 'boolean',
    short: 'h',
    default: false
  }
}
const { values } = parseArgs({ argv, options })

// version mode
if (values.version) {
  console.log(`${app.name} ${app.version}`)
  process.exit(0)
}

// help mode
if (values.help) {
  console.log(syntax)
  process.exit(0)
}

// start the snapshot
const mangogrep = require('../index.js')
mangogrep.start(values).catch((e) => { console.error(e.toString())})
