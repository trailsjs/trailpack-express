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
      name: {
        type: 'string',
        required: true
      },
      roles: {
        collection: 'Role',
        via: 'user'
      }
    }
  }
}
