//const _ = require('lodash')

/**
 * Footprint Policy
 *
 * Validate footprint requests; namely, that the path parameters represent
 * actual and correct models anda actions.
 *
 * @see http://expressjs.com/en/4x/api.html#req
 */
module.exports = {
  create (req, res, next) {
    next()
  },
  find (req, res, next) {
    next()
  },
  findOne (req, res, next) {
    next()
  },
  update (req, res, next) {
    next()
  },
  destroy (req, res, next) {
    next()
  },
  createAssociation (req, res, next) {
    next()
  },
  findAssociation (req, res, next) {
    next()
  },
  findOneAssociation (req, res, next) {
    next()
  },
  updateAssociation (req, res, next) {
    next()
  },
  destroyAssociation (req, res, next) {
    next()
  }
}
