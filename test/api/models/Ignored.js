'use strict'

const Model = require('trails/model')

/**
 * Ignored
 *
 * @description A Ignored model
 */
module.exports = class User extends Model {
  static config(app, Sequelize) {
    return {}
  }

  static schema(app, Sequelize) {
    return {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }
  }
}
