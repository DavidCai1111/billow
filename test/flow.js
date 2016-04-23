/* global describe, it */
require('should')
const Flow = require('../src/flow')
const Droplet = require('../src/droplet')

describe('Flow test', function () {
  it('Should throw when add wrong droplets', function () {
    let flow = new Flow();
    (function () { flow.addDroplets('wrongDroplets') }).should.throw(/should be an instance of Droplet/)
  })

  it('Should pipe data through streams', function () {
    let flow = new Flow({ events: 'error' })
    let count = 0
    flow.addDroplets(new Droplet({
      handler: async function (chunk) {
        chunk.toString().should.eql('test')
        count.should.eql(0)
        count++
      }
    }))

    flow.addDroplets(new Droplet({
      handler: async function (chunk) {
        chunk.toString().should.eql('test')
        count.should.eql(1)
        count++
      }
    }))

    flow.droplets[0].write('test')
  })
})
