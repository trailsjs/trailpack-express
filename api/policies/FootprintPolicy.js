'use strict'

const _ = require('lodash')
const Policy = require('trails/policy')

/**
 * Footprint Policy
 *
 * Validate footprint reqs; namely, that the path parameters represent
 * actual and correct models anda actions. Semantic ORM input validation is
 * performed by the FootprintService.
 *
 * @see http://expressjs.com/en/4x/api.html#req
 */
module.exports = class Footprint extends Policy {
  _isModelIgnored(req) {
    const ignoredModels = _.get(this.app.config, 'footprints.models.ignore', []).map(value => {
      return value.toLowerCase()
    })
    return req.params.model ? ignoredModels.indexOf(req.params.model.toLowerCase()) != -1 :
      ignoredModels.indexOf(req.params.parentModel.toLowerCase()) != -1
  }

  /**
   * Create Policy.
   * @see FootprintController.create
   */
  create(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    if (!_.isPlainObject(req.body) && !_.isArray(req.body)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.body'))
    }

    next()
  }

  /**
   * Find Policy.
   * @see FootprintController.find
   */
  find(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)

    if (req.params.id && !_.isEmpty(criteria)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.find.mutex'))
    }

    next()
  }

  /**
   * Update Policy.
   * @see FootprintController.update
   */
  update(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    if (req.params.id && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.update.mutex'))
    }

    next()
  }

  /**
   * Destroy Policy.
   * @see FootprintController.destroy
   */
  destroy(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    if (req.params.id && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.destroy.mutex'))
    }

    next()
  }

  /**
   * Create Association Policy.
   * @see FootprintController.createAssociation
   */
  createAssociation(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    if (!_.isPlainObject(req.body)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.body'))
    }

    next()
  }

  /**
   * Find Association Policy.
   * @see FootprintController.findAssociation
   */
  findAssociation(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    if (req.params.childId && !_.isEmpty(criteria)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.find.mutex'))
    }

    next()
  }

  /**
   * Update Association Policy.
   * @see FootprintController.updateAssociation
   */
  updateAssociation(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    if (req.params.childId && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.update.mutex'))
    }

    next()
  }

  /**
   * Destroy Association Policy.
   * @see FootprintController.destroyAssociation
   */
  destroyAssociation(req, res, next) {
    if (this._isModelIgnored(req)) {
      return res.boom.forbidden(this.__('errors.footprints.forbidden'))
    }
    if (req.params.childId && !_.isEmpty(req.query)) {
      return res.boom.preconditionFailed(this.__('errors.footprints.destroy.mutex'))
    }

    next()
  }
}
