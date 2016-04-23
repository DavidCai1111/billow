/* global describe, it */
require('should')
const { Writable } = require('stream')
const Billow = require('../src/billow')

describe('Billow test', function () {
  it('Should init with right members', function () {
    let billow = new Billow()
    billow.separator = '\r\n';
    (billow instanceof Writable).should.be.True()
  })


  it('Should separate buffer correctly', function (done) {
    let count = 2
    let countNow = 0
    let testString = 'test\r\n'
    let billow = new Billow()
    let writeable = new Writable({
      write: function (chunk, encoding, next) {
        chunk.toString().should.eql('test')
        next()
        if (++countNow === count) done()
      }
    })

    billow.flows = [{ droplets: [writeable] }]
    billow.write(`${testString}${testString}`)
  })

  it('Should throw when add wrong flow', function () {
    let billow = new Billow();
    (function () { billow.addFlow('wrongFlow') }).should.throw(/should be an instance of Flow/)
  })

  it('Should get hole data when no separator', function (done) {
    let testString = 'test\r\n'
    let billow = new Billow({ separator: null })
    let writeable = new Writable({
      write: function (chunk, encoding, next) {
        chunk.toString().should.eql(`${testString}${testString}`)
        next()
        done()
      }
    })

    billow.flows = [{ droplets: [writeable] }]
    billow.write(`${testString}${testString}`)
  })
})
