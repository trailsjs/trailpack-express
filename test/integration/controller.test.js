const assert = require('assert')
const utils = require('../utils')

describe('express4 controllers', () => {
  describe('DefaultController', () => {
    describe('info', () => {
      it('should return {app: \'1.0.0\'} on GET /default/info', (done) => {
        utils.request('GET', '/default/info', null, function (err, data) {
          assert.deepEqual(JSON.parse(data), {app: '1.0.0'})
          done()
        })
      })
      it('should return {test: \'ok\'} POST on /default/info', (done) => {
        const params = {test: 'ok'}
        utils.request('POST', '/default/info', params, function (err, data) {
          assert.deepEqual(JSON.parse(data), params)
          done()
        })
      })
    })
  })
  describe('ViewController', () => {
    describe('helloWorld', () => {
      it('should return html on GET /', (done) => {
        utils.request('GET', '/', null, function (err, data) {
          assert.equal(data, '<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body><h1>helloWorld</h1></body></html>')
          done()
        })
      })
    })
  })
})

