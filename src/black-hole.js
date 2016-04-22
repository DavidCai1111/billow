'use strict'
const { Writable } = require('stream')

class BlackHole extends Writable {
  _write (chunk, encoding, next) { next() }
}

module.exports = BlackHole
