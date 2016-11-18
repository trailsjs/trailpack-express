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
      it('should return 400 on GET  /validation/failHeaders with headers', (done) => {
        request
          .get('/validation/failHeaders')
          .set('accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            assert.equal(res.body.error, 'Bad Request')
            assert.equal(res.body.statusCode, '400')
            assert.equal(res.body.message, '"host" is not allowed')
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
      it('should return 400 on GET /validation/:id/failParams with params', (done) => {
        request
          .get('/validation/test/failParams')
          .set('accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            assert.equal(res.body.error, 'Bad Request')
            assert.equal(res.body.statusCode, '400')
            assert.equal(res.body.message, '"id" is not allowed')
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
      it('should return 400 on GET /validation/failQuery with query', (done) => {
        request
          .get('/validation/failQuery?validate=test')
          .set('accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            assert.equal(res.body.error, 'Bad Request')
            assert.equal(res.body.statusCode, '400')
            assert.equal(res.body.message, '"validate" is not allowed')
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
      it('should return 400 on GET /validation/failBody with payload', (done) => {
        request
          .post('/validation/failBody')
          .set('accept', 'application/json')
          .send({
            test: 'ok'
          })
          .expect(400)
          .end((err, res) => {
            assert.equal(res.body.error, 'Bad Request')
            assert.equal(res.body.statusCode, '400')
            assert.equal(res.body.message, '"test" is not allowed')
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
      it('should return 400 on GET /validation/testOrder/test with fail on header only', (done) => {
        request
          .get('/validation/testOrder/test')
          .set('accept', 'application/json')
          .expect(400)
          .end((err, res) => {

            assert.equal(res.body.validation.source, 'headers')
            assert.deepEqual(res.body.validation.key, ['requiredheader'])
            done(err)
          })
      })
      it('should return 400 on GET /validation/testOrder/test with fail on query only', (done) => {
        request
          .get('/validation/testOrder/test')
          .set('accept', 'application/json')
          .set('requiredheader', 'valid')
          .expect(400)
          .end((err, res) => {

            assert.equal(res.body.validation.source, 'query')
            assert.deepEqual(res.body.validation.key, ['wrongQuery'])
            done(err)
          })
      })
      it('should return 400 on GET /validation/testOrder/test with fail on params only', (done) => {
        request
          .get('/validation/testOrder/test?wrongQuery=123')
          .set('accept', 'application/json')
          .set('requiredheader', 'valid')

        .expect(400)
          .end((err, res) => {

            assert.deepEqual(res.body.validation.key, ['wrongParam'])
            assert.equal(res.body.validation.source, 'params')
            done(err)
          })
      })
      it('should return 400 on GET /validation/testOrder/test with fail on payload only',
        (done) => {
          request
            .post('/validation/testOrder/1234?wrongQuery=123')
            .set('accept', 'application/json')
            .set('requiredheader', 'valid')
            .expect(400)
            .end((err, res) => {

              assert.deepEqual(res.body.validation.key, ['wrongPayload'])
              assert.equal(res.body.validation.source, 'payload')
              done(err)
            })
        })
      it('should return 400 on POST /validation/testOrder/test with fail on payload only',
        (done) => {
          request
            .post('/validation/testOrder/1234?wrongQuery=123')
            .set('accept', 'application/json')
            .set('requiredheader', 'valid')
            .send({
              'wrongPayload': '1234'
            })
            .expect(400)
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
      it('should return 200 on GET /validation/sendRequestData/123 with typecasted request data (headers, query, params, body)', (done) => {
        request
          .get('/validation/sendRequestData/1?number=2')
          .set('accept', 'application/json')
          .set('numberheader', '3')
          .expect(200)
          .end((err, res) => {
            assert.deepStrictEqual(res.body.params.numberParam, 1)
            assert.deepStrictEqual(res.body.query.number, 2)
            assert.deepStrictEqual(res.body.headers.numberheader, 3)
            done(err)
          })
      })
      it('should return 200 on POST /validation/sendRequestData/123 with typecasted request data (headers, query, params, body)', (done) => {
        request
          .get('/validation/sendRequestData/1')
          .set('accept', 'application/json')
          .set('numberheader', '3')
          .send({
            'number': '2'
          })
          .expect(200)
          .end((err, res) => {
            assert.deepStrictEqual(res.body.params.numberParam, 1)
            assert.deepStrictEqual(res.body.body.number, 2)
            assert.deepStrictEqual(res.body.headers.numberheader, 3)
            done(err)
          })
      })
    })
  })
})
