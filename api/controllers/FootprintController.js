'use strict'
const Controller = require('trails/controller')

const manageErrors = (app, error) => {
  app.log.error(error)
  if (app.env.NODE_ENV != 'production') {
    app.log.warn('this payload error is return for development purpose only and will be only log on production')
    return error
  }
  return new Error()
}

/**
 * Footprint Controller
 *
 * Parse the path and query params and forward them to the FootprintService.
 * The FootprintService is provided by any ORM trailpack, e.g.
 * trailpack-waterline, trailpack-sequelize, etc.
 *
 * @see {@link http://expressjs.com/en/4x/api.html#req}
 */
module.exports = class FootprintController extends Controller {
  create(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)

    FootprintService.create(req.params.model, req.body, options)
      .then(elements => {
        res.status(200).json(elements || {})
      }).catch(error => {
        if (error.code == 'E_VALIDATION') {
          res.status(400).json(error)
        }
        else if (error.code == 'E_NOT_FOUND') {
          res.status(404).json(error)
        }
        else {
          res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
        }
      })
  }

  find(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const id = req.params.id
    let response
    if (id) {
      response = FootprintService.find(req.params.model, id, options)
    }
    else {
      response = FootprintService.find(req.params.model, criteria, options)
    }

    response.then(elements => {
      res.status(elements ? 200 : 404).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
      }
    })

  }

  update(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const id = req.params.id
    this.log.debug('[FootprintController] (update) model =',
      req.params.model, ', criteria =', req.query, id,
      ', values = ', req.body)
    let response
    if (id) {
      response = FootprintService.update(req.params.model, id, req.body, options)
    }
    else {
      response = FootprintService.update(req.params.model, criteria, req.body, options)
    }

    response.then(elements => {
      res.status(200).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
      }
    })

  }

  destroy(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const id = req.params.id
    let response
    if (id) {
      response = FootprintService.destroy(req.params.model, id, options)
    }
    else {
      response = FootprintService.destroy(req.params.model, criteria, options)
    }

    response.then(elements => {
      res.status(200).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
      }
    })
  }

  createAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    FootprintService.createAssociation(req.params.parentModel, req.params.parentId, req.params.childAttribute, req.body, options)
      .then(elements => {
        res.status(200).json(elements || {})
      }).catch(error => {
        if (error.code == 'E_VALIDATION') {
          res.status(400).json(error)
        }
        else if (error.code == 'E_NOT_FOUND') {
          res.status(404).json(error)
        }
        else {
          res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
        }
      })

  }

  findAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId
    let response
    if (childId) {
      response = FootprintService.findAssociation(parentModel,
        parentId, childAttribute, childId, options)
    }
    else {
      response = FootprintService.findAssociation(parentModel,
        parentId, childAttribute, criteria, options)
    }

    response.then(elements => {
      res.status(elements ? 200 : 404).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
      }
    })
  }

  updateAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId
    let response
    if (childId) {
      response = FootprintService.updateAssociation(parentModel,
        parentId, childAttribute, childId, req.body, options)
    }
    else {
      response = FootprintService.updateAssociation(parentModel,
        parentId, childAttribute, criteria, req.body, options)
    }

    response.then(elements => {
      res.status(200).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
      }
    })
  }

  destroyAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId
    let response
    if (childId) {
      response = FootprintService.destroyAssociation(parentModel,
        parentId, childAttribute, childId, options)
    }
    else {
      response = FootprintService.destroyAssociation(parentModel,
        parentId, childAttribute, criteria, options)
    }

    response.then(elements => {
      res.status(200).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.status(500).send(res.boom.wrap(manageErrors(this.app, error), 500))
      }
    })
  }
}
