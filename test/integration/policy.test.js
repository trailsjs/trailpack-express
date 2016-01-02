const assert = require('assert')
const utils = require('../utils')

describe('express4 policies', () => {
  describe('Default', () => {
    describe('success', () => {
      it('should return {app: \'1.0.0\'} on GET /api/v1/default/policySuccess', (done) => {
        utils.request('GET', '/api/v1/default/policySuccess', null, function (err, data) {
          assert.equal(err, null)
          assert.deepEqual(JSON.parse(data), {app: '1.0.0'})
          done()
        })
      })
    })
    describe('fail', () => {
      it('should return an error on GET /api/v1/default/policyFail', (done) => {
        utils.request('GET', '/api/v1/default/policyFail', null, function (err, data) {
          assert.equal(true, err.message.indexOf('Policy fail') != -1)
          assert.equal(err.http_code, 500)
          done()
        })
      })
    })
    describe('intercept', () => {
      it('should return {result: \'intercept\'} on GET /api/v1/default/policyIntercept', (done) => {
        utils.request('GET', '/api/v1/default/policyIntercept', null, function (err, data) {
          assert.equal(err, null)
          assert.deepEqual(JSON.parse(data), {result: 'intercept'})
          done()
        })
      })
    })
  })
})
