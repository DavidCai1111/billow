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
