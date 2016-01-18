'use strict'

const assert = require('assert')
const supertest = require('supertest')

describe('express4 controllers', () => {
  let request
  before(() => {
    request = supertest('http://localhost:3000')
  })
  describe('DefaultController', () => {
    describe('info', () => {
      it('should return {app: \'1.0.0\'} on GET /default/info', (done) => {
        request
          .get('/default/info')
          .expect(200)
          .end((err, res) => {
            const data = res.body
            assert.deepEqual(data, {app: '1.0.0'})
            done(err)
          })
      })
      it('should return {test: \'ok\'} POST on /default/info', (done) => {
        request
          .post('/default/info')
          .send({test: 'ok'})
          .expect(200)
          .end((err, res) => {
            const data = res.body
            assert.deepEqual(data, {test: 'ok'})
            done(err)
          })
      })
    })
  })
  describe('ViewController', () => {
    describe('helloWorld', () => {
      it('should return html on GET /', (done) => {
        request
          .get('/')
          .expect(200)
          .end((err, res) => {
            const data = res.text
            assert.deepEqual(data, '<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body><h1>helloWorld</h1></body></html>')
            done(err)
          })
      })
    })
  })
})
