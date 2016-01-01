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
    this.api.services.FootprintService.create(req.params.model, req.body, {})
      .then(function (elements) {
        res.status(201).json(elements)
      }).catch(function (error) {
      res.status(500).json(error)
    })
  },
  find (req, res) {
    const criteria = {}
    if (req.params.id) {
      criteria.id = req.params.id
    }
    this.api.services.FootprintService.find(req.params.model, criteria, {})
      .then(function (elements) {
        res.status(201).json(elements)
      }).catch(function (error) {
      res.status(500).json(error)
    })
  },
  update (req, res) {
    const criteria = {}
    if (req.params.id) {
      criteria.id = req.params.id
    }
    this.api.services.FootprintService
      .update(req.params.model, criteria, req.body, {})
      .then(function (elements) {
        res.status(201).json(elements)
      }).catch(function (error) {
      res.status(500).json(error)
    })
  },
  destroy (req, res) {
    /*this.api.services.FootprintService.destroy(req.params.model, req.params, options)
     .then(function (elements) {
     res.status(201).json(elements)
     }).catch(function (error) {
     res.status(500).json(error)
     })*/
  },
  createAssociation (req, res) {
    /*this.api.services.FootprintService.createAssociation(req.params.parentModel, req.params.parentId, req.params.childModel, req.body, options)
     .then(function (elements) {
     res.status(201).json(elements)
     }).catch(function (error) {
     res.status(500).json(error)
     })*/
  },
  findAssociation (req, res) {
    /*this.api.services.FootprintService.findAssociation(req.params.parentModel, req.params.parentId, req.params.childModel, criteria, options)
     .then(function (elements) {
     res.status(201).json(elements)
     }).catch(function (error) {
     res.status(500).json(error)
     })*/
  },
  updateAssociation (req, res) {
    /*this.api.services.FootprintService.updateAssociation(req.params.parentModel, req.params.parentId, req.params.childModel, criteria, req.body, options)
     .then(function (elements) {
     res.status(201).json(elements)
     }).catch(function (error) {
     res.status(500).json(error)
     })*/
  },
  destroyAssociation (req, res) {
    /*this.api.services.FootprintService.destroyAssociation(req.params.parentModel, req.params.parentId, req.params.childModel, req.params.childId, options)
     .then(function (elements) {
     res.status(201).json(elements)
     }).catch(function (error) {
     res.status(500).json(error)
     })*/
  }
}
