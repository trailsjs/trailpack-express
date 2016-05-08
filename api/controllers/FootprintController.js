'use strict'
const Controller = require('trails-controller')

const modelExist = (modelName, app) =>{
  const capitalizeName = modelName[0].toUpperCase() + modelName.substr(1).toLowerCase()
  const Model = app.orm[modelName] || app.orm[capitalizeName]
  return Model
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

    if (modelExist(req.params.model, this.app)) {
      FootprintService.create(req.params.model, req.body, options)
        .then(function (elements) {
          res.status(200).json(elements)
        }).catch(function (error) {
          res.boom.wrap(error)
        })
    }
    else {
      res.boom.notFound()
    }

  }

  find(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const id = req.params.id
    if (modelExist(req.params.model, this.app)) {
      let response
      if (id) {
        response = FootprintService.find(req.params.model, id, options)
      }
      else {
        response = FootprintService.find(req.params.model, criteria, options)
      }

      response.then(elements => {
        res.status(elements ? 200 : 404).json(elements)
      }).catch(function(error) {
        res.boom.wrap(error)
      })
    }
    else {
      res.boom.notFound()
    }
  }

  update(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)

    const id = req.params.id

    this.log.debug('[FootprintController] (update) model =',
      req.params.model, ', criteria =', req.query, req.params.id,
      ', values = ', req.body)
    if (modelExist(req.params.model, this.app)) {
      let response
      if (id) {
        response = FootprintService.update(req.params.model, id, req.body, options)
      }
      else {
        response = FootprintService.update(req.params.model, criteria, req.body)
      }

      response.then(function(elements) {
        res.status(200).json(elements)
      }).catch(function(error) {
        res.boom.wrap(error)
      })
    }
    else {
      res.boom.notFound()
    }
  }

  destroy(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const id = req.params.id

    if (modelExist(req.params.model, this.app)) {
      let response
      if (id) {
        response = FootprintService.destroy(req.params.model, id, options)
      }
      else {
        response = FootprintService.destroy(req.params.model, criteria, options)
      }

      response.then(function (elements) {
        res.status(200).json(elements)
      }).catch(function (error) {
        res.boom.wrap(error)
      })
    }
    else {
      res.boom.notFound()
    }
  }

  createAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    if (modelExist(req.params.parentModel, this.app)) {
      FootprintService.createAssociation(req.params.parentModel, req.params.parentId, req.params.childAttribute, req.body, options)
        .then(function(elements) {
          res.status(200).json(elements)
        }).catch(function(error) {
          res.boom.wrap(error)
        })
    }
    else {
      res.boom.notFound()
    }
  }

  findAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId

    if (modelExist(req.params.parentModel, this.app)) {
      let response
      if (childId) {
        response = FootprintService.findAssociation(parentModel, parentId, childAttribute, childId, options)
      }
      else {
        response = FootprintService.findAssociation(parentModel, parentId, childAttribute, criteria, options)
      }

      response.then(function (elements) {
        res.status(elements ? 200 : 404).json(elements)
      }).catch(function (error) {
        res.boom.wrap(error)
      })
    }
    else {
      res.boom.notFound()
    }
  }

  updateAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId

    if (modelExist(req.params.parentModel, this.app)) {
      let response
      if (childId) {
        response = FootprintService.updateAssociation(parentModel, parentId, childAttribute, childId, req.body, options)
      }
      else {
        response = FootprintService.updateAssociation(parentModel, parentId, childAttribute, criteria, req.body, options)
      }

      response.then(function (elements) {
        res.status(200).json(elements)
      }).catch(function (error) {
        res.boom.wrap(error)
      })
    }
    else {
      res.boom.notFound()
    }
  }

  destroyAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId

    if (modelExist(req.params.parentModel, this.app)) {
      let response
      if (childId) {
        response = FootprintService.destroyAssociation(parentModel, parentId, childAttribute, childId, options)
      }
      else {
        response = FootprintService.destroyAssociation(parentModel, parentId, childAttribute, criteria, options)
      }

      response.then(function (elements) {
        res.status(200).json(elements)
      }).catch(function (error) {
        res.boom.wrap(error)
      })
    }
    else {
      res.boom.notFound()
    }
  }
}
