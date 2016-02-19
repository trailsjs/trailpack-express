'use strict'

const assert = require('assert')
const supertest = require('supertest')

describe('FootprintController', () => {
  let request, userId
  before(() => {
    request = supertest('http://localhost:3000')
  })

  describe('#create', () => {
    it('should insert a record', done => {
      request
        .post('/api/v1/user')
        .send({name: 'createtest1'})
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
  })
  describe('#find', () => {
    it('should find a single record', done => {
      request
        .get('/api/v1/user/' + userId)
        .expect(200)
        .end((err, res) => {
          const user = res.body
          assert.equal(user.name, 'createtest1')
          done(err)
        })
    })
    it('should find a set of records', done => {
      request
        .get('/api/v1/user')
        .query({name: 'createtest1'})
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
        .post('/api/v1/user')
        .send({name: 'updatetest1'})
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.name, 'updatetest1')
          userId = res.body.id
          done(err)
        })
    })
    it('should update a single record', done => {
      request
        .put('/api/v1/user/' + userId)
        .send({name: 'updatetest2'})
        .expect(200)
        .end((err, res) => {
          const user = res.body
          assert.equal(user.id, userId)
          assert.equal(user.name, 'updatetest2')
          done(err)
        })
    })
    it('should update a set of records', done => {
      request
        .put('/api/v1/user')
        .query({name: 'updatetest1'})
        .send({name: 'updatetest2'})
        .expect(200)
        .end((err, res) => {
          const user = res.body[0]
          if (user) {
            assert.equal(user.id, userId)
            assert.equal(user.name, 'updatetest2')
          }
          done(err)
        })
    })
  })
  describe('#destroy', () => {
    let userId
    beforeEach(done => {
      request
        .post('/api/v1/user')
        .send({name: 'destroytest1'})
        .expect(200)
        .end((err, res) => {
          assert.equal(res.body.name, 'destroytest1')
          userId = res.body.id
          done(err)
        })
    })
    it('should destroy a single record', done => {
      request
        .del('/api/v1/user/' + userId)
        .expect(200)
        .end((err, res) => {
          const user = res.body
          assert.equal(user.id, userId)
          assert.equal(user.name, 'destroytest1')
          done(err)
        })
    })
    it('should destroy a set of records', done => {
      request
        .del('/api/v1/user')
        .query({name: 'destroytest1'})
        .expect(200)
        .end((err, res) => {
          const user = res.body[0]
          assert.equal(user.id, userId)
          assert.equal(user.name, 'destroytest1')
          done(err)
        })
    })
  })
  describe('#createAssociation', () => {
    let userId
    before(done => {
      request
        .post('/api/v1/user')
        .send({name: 'createtest1'})
        .expect(200)
        .end((err, res) => {
          userId = res.body.id
          done(err)
        })
    })
    it('should insert an associated record', done => {
      request
        .post('/api/v1/user/' + userId + '/roles')
        .send({name: 'associatedroletest1'})
        .expect(200)
        .end((err, res) => {
          const role = res.body

          assert(role)
          assert.equal(role.name, 'associatedroletest1')
          assert.equal(role.user, userId)
          done(err)
        })
    })
  })
  describe('#findAssociation', () => {
    let userId, roleId
    before(done => {
      request
        .post('/api/v1/user')
        .send({name: 'createtest1'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          userId = res.body.id
          request
            .post('/api/v1/user/' + userId + '/roles')
            .send({name: 'associatedroletest1'})
            .expect(200)
            .end((err, res) => {
              roleId = res.body.id
              done(err)
            })
        })
    })
    it('should find a single associated record ("one")', done => {
      request
        .get('/api/v1/role/' + roleId + '/user')
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
        .get('/api/v1/user/' + userId + '/roles')
        .expect(200)
        .end((err, res) => {
          const roles = res.body
          assert(roles.length)
          assert.equal(roles[0].user, userId)
          done(err)
        })
    })
    it('should find a set of associated records ("many") and populate the parent association', done => {
      request
        .get('/api/v1/user/' + userId + '/roles')
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
        .get('/api/v1/user/' + userId + '/roles/' + roleId)
        .expect(200)
        .end((err, res) => {
          const role = res.body
          assert(role)
          assert.equal(role.id, roleId)
          assert.equal(role.user, userId)
          done(err)
        })
    })
  })
  describe('#updateAssociation', () => {
    let userId, roleId
    beforeEach(done => {
      request
        .post('/api/v1/user')
        .send({name: 'updateassociationtest1'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          userId = res.body.id
          request
            .post('/api/v1/user/' + userId + '/roles')
            .send({name: 'associatedroletest2'})
            .expect(200)
            .end((err, res) => {
              roleId = res.body.id
              done(err)
            })
        })
    })
    it('should update an associated record', done => {
      request
        .put('/api/v1/role/' + roleId + '/user')
        .send({
          name: 'updateassociationtest2'
        })
        .expect(200)
        .end((err, res) => {
          const user = res.body
          assert(user)
          assert.equal(user.name, 'updateassociationtest2')
          done(err)
        })
    })
    it('should update a set of associated records', done => {
      request
        .put('/api/v1/user/' + userId + '/roles')
        .send({
          name: 'updateassociationtest2'
        })
        .expect(200)
        .end((err, res) => {
          const roles = res.body
          assert(roles.length)
          assert.equal(roles[0].name, 'updateassociationtest2')
          done(err)
        })
    })
  })
  describe('#destroyAssociation', () => {
    let userId, roleId
    beforeEach(done => {
      request
        .post('/api/v1/user')
        .send({name: 'destroyassociationtest1'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          userId = res.body.id
          request
            .post('/api/v1/user/' + userId + '/roles')
            .send({name: 'associatedroletest3'})
            .expect(200)
            .end((err, res) => {
              roleId = res.body.id
              done(err)
            })
        })
    })
    it('should delete a single associated record', done => {
      request
        .del('/api/v1/role/' + roleId + '/user')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          const user = res.body
          assert(user)
          assert.equal(user.id, userId)

          request
            .get('/api/v1/user/' + userId)
            .expect(404)
            .end((err, res) => {
              if (err) return done(err)

              done()
            })
        })
    })
  })
})
