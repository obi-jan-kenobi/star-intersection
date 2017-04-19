'use strict'

const expect = require('chai').expect
const {starred} = require('../github')

describe('starred', () => {
  it('should work with a proper user', done => {
    starred('obi-jan-kenobi').fork(_ => _, results => {
      expect(results).to.not.be.empty
      done()
    })    
  })
})
