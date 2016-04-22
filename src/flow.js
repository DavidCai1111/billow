'use strict'
const EventEmitter = require('events')
const concatStream = require('concat-streams')
const Droplet = require('./droplet')
const { last, proxyEvents } = require('./utils')

class Flow extends EventEmitter {
  constructor ({ events = ['error', 'dropletError'] } = {}) {
    super()
    this.events = events
    this.droplets = []
  }

  addDroplets (droplets) {
    if (!Array.isArray(droplets)) droplets = [droplets]
    for (let droplet of droplets) {
      if (!(droplet instanceof Droplet)) throw new TypeError(`${droplet} should be an instance of Droplet`)
    }

    let source
    if (this.droplets.length === 0) source = concatStream(droplets, this.events)
    else source = concatStream([last(this.droplets)].concat(droplets), this.events)

    proxyEvents(source, this, this.events)
    this.droplets = this.droplets.concat(droplets)

    return this
  }
}

module.exports = Flow
