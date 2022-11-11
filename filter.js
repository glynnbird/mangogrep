const stream = require('stream')
const psc = require('pouchdb-selector-core')

const fastMatchesSelector = (doc, massagedSelector) => {
  const row = {
    doc: doc
  }
  const rowsMatched = psc.filterInMemoryFields([row], { selector: massagedSelector }, Object.keys(massagedSelector))
  return rowsMatched && rowsMatched.length === 1
}

module.exports = function (selector) {
  const massagedSelector = psc.massageSelector(selector)
  const filter = new stream.Transform({ objectMode: true })
  filter._transform = function (obj, encoding, done) {
    let retval = null
    //console.error('>', obj,'\n')
    // pass object to next stream handler
    if (Array.isArray(obj)) {
      for(const o of obj) {
        if (o && fastMatchesSelector(o, massagedSelector)) {
          this.push(JSON.stringify(o)+'\n')
        } 
      }
    } else {
      if (obj && fastMatchesSelector(obj, massagedSelector)) {
        this.push(JSON.stringify(obj)+'\n')
      } 
    }
    done()
  }

  return filter
}