'use strict'

const assert = require('assert')
const supertest = require('supertest')

describe('express options', () => {
  let request
  before(() => {
    request = supertest('https://localhost:3030')
  })

  it('Should execute init method', () => {
    assert(global.app.packs.express.server.initOk)
  })

  describe('Should use CORS', () => {
    it('should have CORS headers information', done => {
      request
        .get('/default/info')
        .expect('access-control-allow-origin', '*')
        .expect(200)
        .end((err, res) => {
          done(err)
        })
    })
    it('should have CORS headers information for specific route', done => {
      request
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            assert(res.headers['access-control-allow-origin'])
            //FIXME update trailpack-router to have origin as string only
            //assert.equal(res.headers['access-control-allow-origin'], 'http://trailsjs.io')
          }
          done(err)
        })
    })
  })

  describe('Should serve static file', () => {
    it('should return file on GET /node_modules/trails/index.js', done => {
      request
        .get('/node_modules/index.js')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            assert.equal(res.type, 'application/javascript')
          }
          done(err)
        })
    })
  })

  describe('Should have default methods', () => {
    it('should return 404 page on GET /default/notFound', done => {
      request
        .get('/default/notFound')
        .set('Accept', 'text/html')
        .expect(404)
        .end((err, res) => {
          if (!err) {
            assert.equal(res.text, '<h1>404</h1>')
          }
          done(err)
        })
    })
    it('should return 500 page on GET /default/notFound', done => {
      request
        .get('/default/serverError')
        .set('Accept', 'text/html')
        .expect(500)
        .end((err, res) => {
          if (!err) {
            assert.equal(res.text, '<h1>500</h1>')
          }
          done(err)
        })
    })
    it('should return 404 json on GET /default/notFound', done => {
      request
        .get('/default/notFound')
        .expect(404)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (!err) {
            assert.deepEqual(res.body, {
              error: 'Not found'
            })
          }
          done(err)
        })
    })
    it('should return 500 json on GET /default/serverError', done => {
      request
        .get('/default/serverError')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          if (!err) {
            assert.deepEqual(res.body, {
              error: 'Internal Server Error'
            })
          }
          done(err)
        })
    })
  })

  describe('Should start with HTTPS/SSL on port 3030', () => {
    it('should return {app: \'3.0.0\'} on GET /default/info', done => {
      request
        .get('/default/info')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            const data = res.body
            assert.deepEqual(data, {
              app: '3.0.0'
            })
          }
          done(err)
        })
    })
  })

  describe('Should keep route config on handlers', () => {
    it('should return route config on GET /default/routeConfig', done => {
      request
        .get('/default/routeConfig')
        .expect(200)
        .end((err, res) => {
          if (!err) {
            const data = res.body
            assert.deepEqual(data, {
              app: {
                customConfig: true,
                results: 'ok'
              },
              pre: []
            })
          }
          done(err)
        })
    })
  })
})
