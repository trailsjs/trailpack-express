/**
 * Pet
 *
 * @description A Pet model
 */
module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    user: {
      model: 'User'
    }
  }
}
