'use strict'

import { handler } from '../../app.mjs'
import { expect } from 'chai'
import { describe, it } from 'mocha'

var event, context

describe('Tests index', function () {
  it('verifies successful response', async () => {
    const result = await handler(event, context)

    // print uuid
    console.log(result.body)
  })
})
