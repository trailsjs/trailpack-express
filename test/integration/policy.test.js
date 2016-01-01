const assert = require('assert')
const utils = require('../utils')

describe('express4 policies', () => {
  describe('Default', () => {
    describe('success', () => {
      it('should return {app: \'1.0.0\'} on GET /default/policySuccess', (done) => {
        utils.request('GET', '/default/policySuccess', null, function (err, data) {
          assert.deepEqual(JSON.parse(data), {app: '1.0.0'})
          done()
        })
      })
    })
    describe('fail', () => {
      it('should return an error on GET /default/policyFail', (done) => {
        utils.request('GET', '/default/policyFail', null, function (err, data) {
          assert.equal(true, err.message.indexOf('Policy fail') != -1)
          assert.equal(err.http_code, 500)
          done()
        })
      })
    })
    describe('intersept', () => {
      it('should return {result: \'intercept\'} on GET /default/policyIntercept', (done) => {
        utils.request('GET', '/default/policyIntercept', null, function (err, data) {
          assert.deepEqual(JSON.parse(data), {result: 'intercept'})
          done()
        })
      })
    })
  })
})

