# billow
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/DavidCai1993/billow.svg?branch=master)](https://travis-ci.org/DavidCai1993/billow)
[![Coverage Status](https://coveralls.io/repos/github/DavidCai1993/billow/badge.svg?branch=master)](https://coveralls.io/github/DavidCai1993/billow?branch=master)

A stream pipeline based message processing framework.

## Install

```
npm install billow
```

## Usage

```js
'use strict'
const { Billow, Flow, Droplet } = require('billow')

let billow = new Billow({ separator: '\r\n' })
let flowOne = new Flow({ events: ['error', 'dropletError'] })
let flowTwo = new Flow({ events: ['error', 'dropletError'] })

flowOne.on('error', console.error).on('dropletError', console.error)
flowTwo.on('error', console.error).on('dropletError', console.error)

flowOne.addDroplets([
  new Droplet({
    handler: async function (chunk, encoding) {
      return await Promise.resolve(`${chunk.toString()}==`)
    }
  }),
  new Droplet({
    handler: function (chunk, encoding) {
      console.log(chunk.toString())
    }
  })
])

flowTwo.addDroplets([
  new Droplet({
    handler: async function (chunk, encoding) {
      return await Promise.resolve(`${chunk.toString()}~~`)
    }
  }),
  new Droplet({
    handler: function (chunk, encoding) {
      console.log(chunk.toString())
    }
  })
])

billow.addFlow(flowOne).addFlow(flowTwo).write('billow!\r\nbillow!\r\n')
// billow!==
// billow!~~
// billow!==
// billow!~~
```

## How it works

`Billow`'s workflow is based on `Flow` which is the combination of `Droplet`. Each `Droplet` is an implementation of Node.js transform stream, in which you can use `async / await` function to handle the asynchronous data processing logic with happiness. And `Flow` is the abstact pipeline of those `Droplet`s, so the data transmission in `Flow` is very fast and heap memory saved. Because Node.js transform stream will buffer the data when there is no downstream, so all data in `Flow`s will be piped to a writable stream which name is `blackHole` eventually to prevent the potential resident memory leak.

```

        | =>          flow one       =>       |
        | ( droplet(1) => droplet(2) => ... ) |
        |                                     |
data => | =>          flow two       =>       | => blackHole
        | ( droplet(4) => droplet(3) => ... ) |
        |                                     |
        | =>          other flows    =>       |

```

## API

### Class: Billow

#### new Billow({ separator, highWaterMark })
  - separator `Number` : The separator to separate the in coming buffer, if separator is set to be `null`, then `billow` will pass the buffer directly to the `flows`, by default it is `'\r\n'`.
  - highWaterMark `Number` : If provided, it will be passed to the inside `stream.Writable` contructor.

return a new instance of `Billow`.

#### addFlow(flow)
  - flow `Flow` : An instance of `flow`.

Register a new `flow` to `billow`.

### Class: Flow

#### new Flow({ events })

  - events `Array<String>` : The events you want to listen emitted from the `droplet`s of this `flow`.

return a new instance of `Flow`.

#### addDroplets(droplets)

  - droplets `Droplet | Array<Droplet>` : The `droplet`s you want to add to the `flow`.

Register new `droplets` to `flow`.

### Class: Droplet

#### new Droplet({ handler , highWaterMark})

  - handler `async function (chunk, encoding) {}` : The handler to process the `chunk`, the value this function returns will be pass to the next `droplet` in current `flow`.
  - highWaterMark `Number` : If provided, it will be passed to the inside `stream.Transform` contructor.

return a new instance of `Droplet`.
