'use strict'
const { Transform } = require('stream')
const { ensureBuffer } = require('./utils')

class Droplet extends Transform {
  constructor ({ handler, highWaterMark = 16384 } = {}) {
    if (!handler || typeof handler !== 'function') throw new TypeError(`${handler} should be a function`)

    super({ highWaterMark })
    this.handler = handler
  }

  async _transform (chunk, encoding, next) {
    try {
      next(null, ensureBuffer(await this.handler(chunk, encoding) || chunk))
    } catch (error) {
      this.emit('dropletError', error)
      next(null, chunk)
    }
  }
}

module.exports = Droplet
