'use strict'

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
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })
      it('should return 200 on GET /validation/successHeaders with headers', (done) => {
        request
          .get('/validation/successHeaders')
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
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })

      it('should return 200 on GET /validation/:test/failParams with params', (done) => {
        request
          .get('/validation/test/successParams')
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
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })
      it('should return 200 on GET /validation/successQuery with query', (done) => {
        request
          .get('/validation/successQuery?validate=test')
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
          .send({
            test: 'ok'
          })
          .expect(500)
          .end((err, res) => {
            done(err)
          })
      })
      it('should return 200 on POSt /validation/successBody with payload', (done) => {
        request
          .post('/validation/successBody')
          .send({
            test: 'ok'
          })
          .expect(200)
          .end((err, res) => {
            done(err)
          })
      })
    })
  })
})
