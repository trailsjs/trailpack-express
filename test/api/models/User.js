/**
 * Role
 *
 * @description A Role model
 */
module.exports = {
  attributes: {
    name: 'string',
    roles: {
      collection: 'Role',
      via: 'user'
    }
  }
}
