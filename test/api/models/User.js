'use strict'

const Model = require('trails/lib/Model')

/**
 * User
 *
 * @description A User model
 */
module.exports = class User extends Model {
  static config(app, Sequelize) {
    return {
      //More informations about supported models options here : http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
      options: {
        classMethods: {
          //If you need associations, put them here
          associate: (models) => {
            //More information about associations here : http://docs.sequelizejs.com/en/latest/docs/associations/
            models.User.hasMany(models.Role, {
              as: 'roles',
              onDelete: 'CASCADE',
              foreignKey: {
                name: 'userId',
                allowNull: false
              }
            })
          }
        }
      }
    }
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
