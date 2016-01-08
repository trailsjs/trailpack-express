'use strict'

/**
 * Footprint Controller
 *
 * Parse the path and query params and forward them to the FootprintService.
 * The FootprintService is provided by any ORM trailpack, e.g.
 * trailpack-waterline, trailpack-sequelize, etc.
 *
 * @see {@link http://expressjs.com/en/4x/api.html#req}
 */
module.exports = {
  create (req, res) {
    const FootprintService = this.api.services.FootprintService
    FootprintService.create(req.params.model, req.body)
      .then(function (elements) {
        res.status(201).json(elements)
      }).catch(function (error) {
      res.boom.wrap(error)
    })
  },
  find (req, res) {
    const FootprintService = this.api.services.FootprintService
    const id = req.params.id

    let response
    if (id) {
      response = FootprintService.find(req.params.model, id, {findOne: true})
    }
    else {
      response = FootprintService.find(req.params.model, req.query)
    }

    response.then(function (elements) {
      res.status(elements ? 201 : 404).json(elements)
    }).catch(function (error) {
      res.boom.wrap(error)
    })
  },
  update (req, res) {
    const FootprintService = this.api.services.FootprintService
    const id = req.params.id

    let response
    if (id) {
      response = FootprintService.update(req.params.model, id, req.body, {findOne: true})
    }
    else {
      response = FootprintService.update(req.params.model, req.query, req.body)
    }

    response.then(function (elements) {
      res.status(201).json(elements)
    }).catch(function (error) {
      res.boom.wrap(error)
    })
  },
  destroy (req, res) {
    const FootprintService = this.api.services.FootprintService
    const id = req.params.id

    let response
    if (id) {
      response = FootprintService.destroy(req.params.model, id, {findOne: true})
    }
    else {
      response = FootprintService.destroy(req.params.model, req.query)
    }

    response.then(function (elements) {
      res.status(201).json(elements)
    }).catch(function (error) {
      res.boom.wrap(error)
    })
  },
  createAssociation (req, res) {
    const FootprintService = this.api.services.FootprintService
    FootprintService.createAssociation(req.params.parentModel, req.params.parentId, req.params.childAttribute, req.body)
      .then(function (elements) {
        res.status(201).json(elements)
      }).catch(function (error) {
      res.boom.wrap(error)
    })
  },
  findAssociation (req, res) {
    const FootprintService = this.api.services.FootprintService
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId

    let response
    if (childId) {
      response = FootprintService.findAssociation(parentModel, parentId, childAttribute, childId, {findOne: true})
    }
    else {
      response = FootprintService.findAssociation(parentModel, parentId, childAttribute, req.query)
    }

    response.then(function (elements) {
      res.status(elements ? 201 : 404).json(elements)
    }).catch(function (error) {
      res.boom.wrap(error)
    })

  },
  updateAssociation (req, res) {
    const FootprintService = this.api.services.FootprintService
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId

    let response
    if (childId) {
      response = FootprintService.updateAssociation(parentModel, parentId, childAttribute, childId, req.body, {findOne: true})
    }
    else {
      response = FootprintService.updateAssociation(parentModel, parentId, childAttribute, req.query, req.body)
    }

    response.then(function (elements) {
      res.status(201).json(elements)
    }).catch(function (error) {
      res.boom.wrap(error)
    })
  },
  destroyAssociation (req, res) {
    const FootprintService = this.api.services.FootprintService
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId

    let response
    if (childId) {
      response = FootprintService.destroyAssociation(parentModel, parentId, childAttribute, childId, {findOne: true})
    }
    else {
      response = FootprintService.destroyAssociation(parentModel, parentId, childAttribute, req.query)
    }

    response.then(function (elements) {
      res.status(201).json(elements)
    }).catch(function (error) {
      res.boom.wrap(error)
    })

  }
}
