const _ = require('lodash')

/**
 * Footprint Policy
 *
 * Validate footprint reqs; namely, that the path parameters represent
 * actual and correct models anda actions. Semantic ORM input validation is
 * performed by the FootprintService.
 *
 * @see http://expressjs.com/en/4x/api.html#req
 */
module.exports = {

  /**
   * Create Policy.
   * @see FootprintController.create
   */
  create (req, res, next) {
    if (!_.isPlainObject(req.body)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.body'))
    }

    next()
  },

  /**
   * Find Policy.
   * @see FootprintController.find
   */
  find (req, res, next) {
    if (req.params.id && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.find.mutex'))
    }

    next()
  },

  /**
   * Update Policy.
   * @see FootprintController.update
   */
  update (req, res, next) {
    if (req.params.id && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.update.mutex'))
    }

    next()
  },

  /**
   * Destroy Policy.
   * @see FootprintController.destroy
   */
  destroy (req, res, next) {
    if (req.params.id && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.destroy.mutex'))
    }

    next()
  },

  /**
   * Create Association Policy.
   * @see FootprintController.createAssociation
   */
  createAssociation (req, res, next) {
    if (!_.isPlainObject(req.body)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.body'))
    }

    next()
  },

  /**
   * Find Association Policy.
   * @see FootprintController.findAssociation
   */
  findAssociation (req, res, next) {
    if (req.params.childId && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.find.mutex'))
    }

    next()
  },

  /**
   * Update Association Policy.
   * @see FootprintController.updateAssociation
   */
  updateAssociation (req, res, next) {
    if (req.params.childId && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.update.mutex'))
    }

    next()
  },

  /**
   * Destroy Association Policy.
   * @see FootprintController.destroyAssociation
   */
  destroyAssociation (req, res, next) {
    if (req.params.childId && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.destroy.mutex'))
    }

    next()
  }
}
