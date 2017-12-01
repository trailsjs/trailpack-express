'use strict'

const assert = require('assert')
const supertest = require('supertest')

describe('FootprintController', () => {
  let request, userId
  before(() => {
    request = supertest('http://localhost:3000/api/v1')
  })

  describe('#ignored model', () => {
    it('should not insert a record', done => {
      request
        .post('/ignored')
        .send({
          name: 'createtest1'
        })
        .expect(403)
        .end((err, res) => {
          assert.equal(res.body.message, 'errors.footprints.forbidden')
          assert.equal(res.body.error, 'Forbidden')
          done(err)
        })
    })
    it('should not find', done => {
      request
        .get('/ignored/' + userId)
        .expect(403)
        .end((err, res) => {
          assert.equal(res.body.message, 'errors.footprints.forbidden')
          assert.equal(res.body.error, 'Forbidden')
          done(err)
        })
    })
    it('should not update', done => {
      request
        .put('/ignored/' + userId)
        .send({
          name: 'updatetest2'
        })
        .expect(403)
        .end((err, res) => {
          assert.equal(res.body.message, 'errors.footprints.forbidden')
          assert.equal(res.body.error, 'Forbidden')
          done(err)
        })
    })
    it('should not destroy', done => {
      request
        .del('/ignored/' + userId)
        .expect(403)
        .end((err, res) => {
          assert.equal(res.body.message, 'errors.footprints.forbidden')
          assert.equal(res.body.error, 'Forbidden')
          done(err)
        })
    })
    it('should not insert an associated record', done => {
      request
        .post('/ignored/' + userId + '/roles')
        .send({
          name: 'associatedroletest1'
        })
        .expect(403)
        .end((err, res) => {
          assert.equal(res.body.message, 'errors.footprints.forbidden')
          assert.equal(res.body.error, 'Forbidden')
          done(err)
        })
    })
  })

  describe('#create', () => {
    it('should insert a record', done => {
      request
        .post('/user')
        .send({
          name: 'createtest1'
        })
        .expect(200)
        .end((err, res) => {
          const user = res.body

          assert(user)
          assert(user.id)
          assert.equal(user.name, 'createtest1')

          userId = user.id

          done(err)
        })
    })

    it('should return a validation error', done => {
      request
        .post('/user')
        .send({})
        .expect(400)
        .end((err, res) => {
          const validError = res.body
          assert.equal(validError.code, 'E_VALIDATION')
          assert.equal(validError.errors.length, 1)
          assert.equal(validError.errors[0].path, 'name')
          assert.equal(validError.errors[0].message, 'name cannot be null')
          assert.equal(validError.errors[0].type, 'notNull Violation')
          done(err)
        })
    })
  })
  describe('#find', () => {
    it('should find a single record', done => {
      request
        .get('/user/' + userId)
        .expect(200)
        .end((err, res) => {
          const user = res.body
          assert.equal(user.name, 'createtest1')
          done(err)
        })
    })
    it('should find a set of records', done => {
      request
        .get('/user')
        .query({
          name: 'createtest1'
        })
        .expect(200)
        .end((err, res) => {
          const user = res.body[0]
          assert.equal(user.name, 'createtest1')
          done(err)
        })
    })

    it.skip('TODO should find using "lessThan" query criterion')
    it.skip('TODO should find using "greaterThan" query criterion')
    it.skip('TODO should find using "in" query criterion')
    it.skip('TODO should find using "limit" query option')
    it.skip('TODO should find using "offset" query option')
    it.skip('TODO should find using Date type')
  })
  describe('#update', () => {
    let userId
    beforeEach(done => {
      request
        .post('/user')
        .send({
          name: 'updatetest1'
        })
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.name, 'updatetest1')
          userId = res.body.id
          done(err)
        })
    })
    it('should update a single record', done => {
      request
        .put('/user/' + userId)
        .send({
          name: 'updatetest2'
        })
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body, 1)
          done(err)
        })
    })
    it('should update a set of records', done => {
      request
        .put('/user')
        .query({
          name: 'updatetest1'
        })
        .send({
          name: 'updatetest2'
        })
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body[0], 1)
          done(err)
        })
    })
  })
  describe('#destroy', () => {
    let userId
    beforeEach(done => {
      request
        .post('/user')
        .send({
          name: 'destroytest1'
        })
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.name, 'destroytest1')
          userId = res.body.id
          done(err)
        })
    })
    it('should destroy a single record', done => {
      request
        .del('/user/' + userId)
        .expect(200)
        .end((err, res) => {
          done(err)
        })
    })
    it('should destroy a set of records', done => {
      request
        .del('/user')
        .query({
          name: 'destroytest1'
        })
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body, 1)
          done(err)
        })
    })
  })
  describe('#createAssociation', () => {
    let userId
    before(done => {
      request
        .post('/user')
        .send({
          name: 'createtest1'
        })
        .expect(200)
        .end((err, res) => {
          userId = res.body.id
          done(err)
        })
    })
    it('should insert an associated record', done => {
      request
        .post('/user/' + userId + '/roles')
        .send({
          name: 'associatedroletest1'
        })
        .expect(200)
        .end((err, res) => {
          const role = res.body

          assert(role)
          assert.equal(role.name, 'associatedroletest1')
          assert.equal(role.userId, userId)
          done(err)
        })
    })
  })
  describe('#findAssociation', () => {
    let userId, roleId
    before(done => {
      request
        .post('/user')
        .send({
          name: 'createtest1'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          userId = res.body.id
          request
            .post('/user/' + userId + '/roles')
            .send({
              name: 'associatedroletest1'
            })
            .expect(200)
            .end((err, res) => {
              roleId = res.body.id
              done(err)
            })
        })
    })
    it('should find a single associated record ("one")', done => {
      request
        .get('/role/' + roleId + '/user')
        .expect(200)
        .end((err, res) => {
          const user = res.body
          assert(user)
          assert.equal(user.id, userId)
          done(err)
        })
    })
    it('should find a set of associated records ("many")', done => {
      request
        .get('/user/' + userId + '/roles')
        .expect(200)
        .end((err, res) => {
          const roles = res.body
          assert(roles.length)
          assert.equal(roles[0].user.id, userId)
          done(err)
        })
    })
    it('should find a set of associated records ("many") ' +
      'and populate the parent association', done => {
      request
        .get('/user/' + userId + '/roles')
        .expect(200)
        .query({
          populate: ['user']
        })
        .end((err, res) => {
          const roles = res.body
          assert(roles.length)
          assert.equal(roles[0].user.id, userId)
          done(err)
        })
    })

    it('should find a particular record in an associated set ("many")', done => {
      request
        .get('/user/' + userId + '/roles/' + roleId)
        .expect(200)
        .end((err, res) => {
          const role = res.body[0]
          assert(role)
          assert.equal(role.id, roleId)
          assert.equal(role.user.id, userId)
          done(err)
        })
    })
  })
  describe('#updateAssociation', () => {
    let userId, roleId
    beforeEach(done => {
      request
        .post('/user')
        .send({
          name: 'updateassociationtest1'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          userId = res.body.id
          request
            .post('/user/' + userId + '/roles')
            .send({
              name: 'associatedroletest2'
            })
            .expect(200)
            .end((err, res) => {
              roleId = res.body.id
              done(err)
            })
        })
    })
    it('should update an associated record', done => {
      request
        .put('/role/' + roleId + '/user')
        .send({
          name: 'updateassociationtest2'
        })
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body, 1)
          done(err)
        })
    })
    it('should update a set of associated records', done => {
      request
        .put('/user/' + userId + '/roles')
        .send({
          name: 'updateassociationtest2'
        })
        .expect(200)
        .end((err, res) => {
          const roles = res.body
          assert(roles.length)
          assert.equal(roles[0], 1)
          done(err)
        })
    })
  })
  describe('#destroyAssociation', () => {
    let userId, roleId
    beforeEach(done => {
      request
        .post('/user')
        .send({
          name: 'destroyassociationtest1'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          userId = res.body.id
          request
            .post('/user/' + userId + '/roles')
            .send({
              name: 'associatedroletest3'
            })
            .expect(200)
            .end((err, res) => {
              roleId = res.body.id
              done(err)
            })
        })
    })
    it('should delete a single associated record', done => {
      request
        .del('/role/' + roleId + '/user')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          const user = res.body[0]
          assert(user)
          assert.equal(user.id, userId)

          request
            .get('/user/' + userId)
            .expect(404)
            .end((err, res) => {
              if (err) return done(err)

              done()
            })
        })
    })
  })
})
