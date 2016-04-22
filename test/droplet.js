/* global describe, it */
require('should')
const Flow = require('../src/flow')
const Droplet = require('../src/droplet')

describe('Droplet test', function () {
  it('Should throw when pass wrong handler', function () {
    (function () {
      let _ = new Droplet()
      _
    }).should.throw(/should be a function/)
  })

  it('Should handle async function correctly', function (done) {
    let droplet1 = new Droplet({
      handler: async function (chunk) {
        return await Promise.resolve(`${chunk.toString()}__`)
      }
    })

    let droplet2 = new Droplet({
      handler: async function (chunk) {
        await Promise.resolve(null)
        return `${chunk.toString()}__`
      }
    })

    let droplet3 = new Droplet({
      handler: async function (chunk) {
        chunk.toString().should.eql('test____')
        return done()
      }
    })

    let flow = new Flow()
    flow.addDroplets([droplet1, droplet2, droplet3])
    flow.droplets[0].write('test')
  })
})
