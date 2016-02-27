'use strict'

const Model = require('trails-model')

/**
 * User
 *
 * @description A User model
 */
module.exports = class User extends Model {
  static config() {
  }

  static schema() {
    return {
      name: 'string',
      roles: {
        collection: 'Role',
        via: 'user'
      }
    }
  }
}
