'use strict'

const assert = require('assert')
const supertest = require('supertest')

describe('express4 controllers', () => {
  let request
  before(() => {
    request = supertest('http://localhost:3000')
  })
  describe('ValidationController', () => {
    describe('Validation Header', () => {
      it('should return 500 on GET  /validation/failHeaders with headers', (done) => {
        request
          .get('/validation/failHeaders')
          .set('accept', 'application/json')
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })
      it('should return 200 on GET /validation/successHeaders with headers', (done) => {
        request
          .get('/validation/successHeaders')
          .set('accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            done(err)
          })
      })
    })
    describe('Validation Params', () => {
      it('should return 500 on GET /validation/:test/failParams with params', (done) => {
        request
          .get('/validation/test/failParams')
          .set('accept', 'application/json')
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })

      it('should return 200 on GET /validation/:test/failParams with params', (done) => {
        request
          .get('/validation/test/successParams')
          .set('accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            done(err)
          })
      })
    })
    describe('Validation query', () => {
      it('should return 500 on GET /validation/failQuery with query', (done) => {
        request
          .get('/validation/failQuery?validate=test')
          .set('accept', 'application/json')
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })
      it('should return 200 on GET /validation/successQuery with query', (done) => {
        request
          .get('/validation/successQuery?validate=test')
          .set('accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            done(err)
          })
      })
    })

    describe('Validation body', () => {
      it('should return 500 on GET /validation/failBody with payload', (done) => {
        request
          .post('/validation/failBody')
          .set('accept', 'application/json')
          .send({
            test: 'ok'
          })
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })
      it('should return 200 on POST /validation/successBody with payload', (done) => {
        request
          .post('/validation/successBody')
          .set('accept', 'application/json')
          .send({
            test: 'ok'
          })
          .expect(200)
          .end((err, res) => {
            done(err)
          })
      })
    })
    describe('Validation Order', () => {
      it('should return 500 on GET /validation/testOrder/test with fail on header only', (done) => {
        request
          .get('/validation/testOrder/test')
          .set('accept', 'application/json')
          .expect(500)
          .end((err, res) => {

            assert.equal(res.body.validation.source, 'headers')
            assert.deepEqual(res.body.validation.key, ['requiredheader'])
            done(err)
          })
      })
      it('should return 500 on GET /validation/testOrder/test with fail on query only', (done) => {
        request
          .get('/validation/testOrder/test')
          .set('accept', 'application/json')
          .set('requiredheader', 'valid')
          .expect(500)
          .end((err, res) => {

            assert.equal(res.body.validation.source, 'query')
            assert.deepEqual(res.body.validation.key, ['wrongQuery'])
            done(err)
          })
      })
      it('should return 500 on GET /validation/testOrder/test with fail on params only', (done) => {
        request
          .get('/validation/testOrder/test?wrongQuery=123')
          .set('accept', 'application/json')
          .set('requiredheader', 'valid')

        .expect(500)
          .end((err, res) => {

            assert.deepEqual(res.body.validation.key, ['wrongParam'])
            assert.equal(res.body.validation.source, 'params')
            done(err)
          })
      })
      it('should return 500 on GET /validation/testOrder/test with fail on payload only',
        (done) => {
          request
            .post('/validation/testOrder/1234?wrongQuery=123')
            .set('accept', 'application/json')
            .set('requiredheader', 'valid')
            .expect(500)
            .end((err, res) => {

              assert.deepEqual(res.body.validation.key, ['wrongPayload'])
              assert.equal(res.body.validation.source, 'payload')
              done(err)
            })
        })
      it('should return 500 on POST /validation/testOrder/test with fail on payload only',
        (done) => {
          request
            .post('/validation/testOrder/1234?wrongQuery=123')
            .set('accept', 'application/json')
            .set('requiredheader', 'valid')
            .send({
              'wrongPayload': '1234'
            })
            .expect(500)
            .end((err, res) => {

              assert.deepEqual(res.body.validation.key, ['wrongPayload'])
              assert.equal(res.body.validation.source, 'payload')
              done(err)
            })
        })
      it('should return 200 on POST /validation/testOrder/test ', (done) => {
        request
          .post('/validation/testOrder/1234?wrongQuery=123')
          .set('accept', 'application/json')
          .set('requiredheader', 'valid')
          .send({
            'wrongPayload': 'toto@valid.com'
          })
          .expect(200)
          .end((err, res) => {

            assert.equal(res.body.validation, undefined)
            done(err)
          })
      })
    })
  })
})
