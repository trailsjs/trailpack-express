const assert = require('assert')
const utils = require('../utils')

describe('express4 footprints', () => {
  describe('FootprintController', () => {
    describe('create', () => {
      it('should create a user on POST /api/v1/user', (done) => {
        utils.request('POST', '/api/v1/user', {username: 'Toto'}, function (err, data) {
          assert.equal(err, null)
          data = JSON.parse(data)
          assert.equal(data.username, 'Toto')
          assert.equal(data.id, 1)
          done()
        })
      })
    })
    describe('find', () => {
      it('should return a user on GET /api/v1/user/1', (done) => {
        utils.request('GET', '/api/v1/user/1', null, function (err, data) {
          assert.equal(err, null)
          data = JSON.parse(data)
          assert.equal(data.length, 1)
          const user = data[0]
          assert.equal(user.username, 'Toto')
          assert.equal(user.id, 1)
          done()
        })
      })
    })
    /*
    describe('update', () => {
      it('should update a user on PUT /api/v1/user/1', (done) => {
        utils.request('PUT', '/api/v1/user/1', {username: 'Titi'}, function (err, data) {
          assert.equal(err, null)
          data = JSON.parse(data)
          assert.equal(data.username, 'Titi')
          assert.equal(data.id, 1)
          done()
        })
      })
    })*/

    describe('delete', () => {
      it('should delete a user on DELETE /api/v1/user/1', (done) => {
        utils.request('DELETE', '/api/v1/user/1', null, function (err, data) {
          assert.equal(err, null)
          data = JSON.parse(data)
          assert.equal(data.length, 1)
          const user = data[0]
          assert.equal(user.username, 'Toto')
          assert.equal(user.id, 1)
          done()
        })
      })
    })
  })
})
/*

 describe('express4 footprints', () => {
 describe('FootprintController', () => {
 describe('create', () => {
 it('should return create a user on GET /api/v1/user', (done) => {
 utils.request('POST', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('find', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('update', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('destroy', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('createAssociation', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('findAssociation', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('updateAssociation', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 describe('destroyAssociation', () => {
 it('should return an error on GET /api/v1/user', (done) => {
 utils.request('GET', '/api/v1/user', null, function (err, data) {
 //TODO
 done()
 })
 })
 })
 })
 })
 */
