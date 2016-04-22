'use strict'

function last (arr) {
  if (!Array.isArray(arr) || arr.length === 0) throw new Error(`${arr} should be an Array which is not empty`)

  return arr[arr.length - 1]
}

function proxyEvents (source, proxy, events) {
  if (!Array.isArray(events)) events = [events]

  for (let event of events) {
    source.on(event, function () { proxy.emit(event, ...arguments) })
  }

  return source
}

function ensureBuffer (buf) {
  if (Buffer.isBuffer(buf)) return buf
  if (Buffer.from) return Buffer.from(buf)
  return new Buffer(buf)
}

module.exports = { last, proxyEvents, ensureBuffer }
