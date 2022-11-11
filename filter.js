const stream = require('stream')
const psc = require('pouchdb-selector-core')

// quickly see if a document matches a Mango selector
const fastMatchesSelector = (doc, massagedSelector) => {
  const row = {
    doc: doc
  }
  const rowsMatched = psc.filterInMemoryFields([row], { selector: massagedSelector }, Object.keys(massagedSelector))
  return rowsMatched && rowsMatched.length === 1
}

// returns a stream transformer
module.exports = function (selector) {
  // pre-parse the selector
  const massagedSelector = psc.massageSelector(selector)

  // create stream transformer
  const filter = new stream.Transform({ objectMode: true })

  // add _transform function
  filter._transform = function (obj, encoding, done) {

    // if we're passed an Array
    if (Array.isArray(obj)) {
      // treat it as an array of objects
      for(const o of obj) {
        if (o && fastMatchesSelector(o, massagedSelector)) {
          this.push(JSON.stringify(o)+'\n')
        } 
      }
    } else {
      // just a single object
      if (obj && fastMatchesSelector(obj, massagedSelector)) {
        this.push(JSON.stringify(obj)+'\n')
      } 
    }
    done()
  }

  return filter
}