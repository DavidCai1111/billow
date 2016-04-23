'use strict'
const { Writable } = require('stream')
const Flow = require('./flow')
const BlackHole = require('./black-hole')
const { last } = require('./utils')

class Billow extends Writable {
  constructor ({ separator = '\r\n', highWaterMark = 16384 } = {}) {
    super({ highWaterMark })
    this.separator = separator
    this.blackHole = new BlackHole()
    this.flows = []
  }

  _write (chunk, encoding, next) {
    if (!this.separator) {
      for (let flow of this.flows) { flow.droplets[0].write(chunk) }
      return this
    }
    if (this._buffer) chunk = Buffer.concat([this._buffer, chunk])

    let start = 0
    let index = chunk.indexOf(this.separator)

    while (~index) {
      let buffer = chunk.slice(start, index)
      for (let flow of this.flows) { flow.droplets[0].write(buffer) }

      start = index + Buffer.byteLength(this.separator)
      index = chunk.indexOf(this.separator, start)
    }

    this._buffer = chunk.slice(start)
    next()
  }

  addFlow (flow) {
    if (!(flow instanceof Flow)) throw new TypeError(`${flow} should be an instance of Flow`)

    last(flow.droplets).pipe(this.blackHole)
    this.flows.push(flow)

    return this
  }
}

module.exports = Billow
