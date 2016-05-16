'use strict'

const assert = require('assert')
const supertest = require('supertest')

describe('express options', () => {
  let request
  before(() => {
    request = supertest('https://localhost:3030')
  })

  describe('Should use CORS', () => {
    it('should have CORS headers informations', done => {
      request
        .get('/default/info')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            assert(res.headers['access-control-allow-origin'])
            assert.equal(res.headers['access-control-allow-origin'], '*')
          }
          done(err)
        })
    })
    it('should have CORS headers informations for specific route', done => {
      request
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            assert(res.headers['access-control-allow-origin'])
            assert.equal(res.headers['access-control-allow-origin'], 'http://trailsjs.io')
          }
          done(err)
        })
    })
  })

  describe('Should start with HTTPS/SSL on port 3030', () => {
    it('should return {app: \'1.0.0\'} on GET /default/info', done => {
      request
        .get('/default/info')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            const data = res.body
            assert.deepEqual(data, {app: '1.0.0'})
          }
          done(err)
        })
    })
  })

})
