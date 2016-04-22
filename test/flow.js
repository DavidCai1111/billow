/* global describe, it */
require('should')
const Flow = require('../src/flow')

describe('Flow test', function () {
  it('Should throw when add wrong droplets', function () {
    let flow = new Flow();
    (function () { flow.addDroplets('wrongDroplets') }).should.throw(/should be an instance of Droplets/)
  })
})
