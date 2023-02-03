
const filter = require('./filter.js')
const jsonpour = require('jsonpour')
const sqltomango = require('sqltomango')

// stream stdin --> parser --> filter --> stdout
const start = async (opts) => {
  return new Promise((resolve, reject) => {

    if (opts.where) {
      // convert where to a Mango selector
      try {
        const parsed = sqltomango.parse(`SELECT * FROM temp WHERE ${opts.where}`)
        opts.selector = parsed.selector
      } catch (e) {
        return reject(new Error('invalid where SQL'))
      }
    } else if (opts.selector) {
      // just JSON.parse the incoming selector
      try {
        opts.selector = JSON.parse(opts.selector)
      } catch (e) {
        return reject(new Error('invalid selector JSON'))
      }
    } else {
      // if neither where nor selector or supplied, select everything
      opts.selector = {}
    }

    // debug
    if (opts.debug) {
      console.error(JSON.stringify(opts.selector))
    }
    
    // stream stdin --> parser --> filter --> stdout
    process.stdin
      .pipe(jsonpour.parse())
      .pipe(filter(opts.selector))
      .on('error', (e) => {
        reject(e)
      })
      .on('finish', () => {
        resolve()
      })
      .pipe(process.stdout)
  })
}

module.exports = { start }