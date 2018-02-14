'use strict'

const Controller = require('trails/lib/Controller')
const Policy = require('trails/lib/Policy')
const Joi = require('joi')
const methods = require('methods')
const _ = require('lodash')

module.exports = {
  extendsExpressRouter: app => {
    methods.concat('all').forEach(function (method) {
      const originalMethod = app[method]
      app[method] = function (key) {
        const args = [].slice.call(arguments)
        const config = args[1]

        // Check if second argument is the route config object
        if (_.isPlainObject(config)) {
          args[1] = function(req, res, next){
            req.route.config = config
            next()
          }
        }
        return originalMethod.apply(this, args)
      }
    })
  },
  /**
   * Checks if Standard Route
   * @param obj
   * @returns {*}
   */
  isTrailsStandard: function(obj) {
    const className = obj.constructor.name
    if (className === Controller.name || className === Policy.name) {
      return true
    }
    else if (className === 'Object') {
      return false
    }
    else {
      return this.isTrailsStandard(obj.__proto__)
    }
  },
  /**
   * Transform express request to hapi like request
   * @param req as express
   * @param res as express
   * @returns request hapi like object
   */
  createRequest: function(req, res) {
    return {
      raw: {
        req: req,
        res: res
      },
      params: req.params,
      payload: req.body,
      query: req.query,
      headers: req.headers,
      route: req.route,
      url: req.url
    }
  },
  /**
   * Transform express response to hapi like response
   * @param req as express
   * @param res as express
   * @param next as express
   * @returns  response hapi like object
   */
  createResponse: function(req, res, next) {
    const response = (data) => {

      return new Promise((resolve, reject) => {
        if (!data) {
          next()
        }
        else if (data instanceof Error) {
          if (!data.output) {
            data.output = {}
          }
          const code = data.code || data.output.statusCode
          res.status(code || 500).send(data.message)
        }
        else {
          res.send(data)
        }
        resolve()
      })
    }

    response.continue = () => {
      return new Promise((resolve, reject) => {
        next()
        resolve()
      })
    }
    response.header = (key, value) => {
      return new Promise((resolve, reject) => {
        res.set(key, value)
        resolve()
      })
    }
    return response
  },

  /**
   * Returnn an hapi like validation middleware for epxress
   * @param trails route configuration
   * @returns  Joi validation Rules
   */
  createJoiValidationRules: function(route) {

    route.config.validate.body = route.config.validate.payload // hapi compatibility
    const validation = route.config.validate
    const types = ['headers', 'params', 'query', 'body']
    types.forEach((type) => {
      let rule = validation[type]

      // null, undefined, true - anything allowed
      // false - nothing allowed
      // {...} - ... allowed
      rule = (rule === false ? Joi.object({}).allow(null) :
        typeof rule === 'function' ? rule :
        !rule || rule === true ? Joi.any() :
        Joi.compile(rule))
      validation[type] = rule
    })
    return validation
  },

  /**
   * Sorts routes based on Express config.
   * @param options
   * @returns {specificityComparator}
   */
  createSpecificityComparator: function(options) {
    const self = this
    options = options || {}
    // Ascending order flag, defaults to false
    let asc = false
    if (options.order && options.order === 'asc') {
      asc = true
    }
    // Bit misleading: here we mean that the default route is ''
    const defaultRoute = options.default || ''

    return function specificityComparator(routeA, routeB) {
      routeA = (routeA.path || '').toLowerCase()
      routeB = (routeB.path || '').toLowerCase()
      // If it's the default route, push it all the way
      // over to one of the ends
      if (routeA === defaultRoute) {
        return asc ? 1 : -1
        // Also push index route down to end, but not past the default
      }
      else if (/^\/$/.test(routeA) && routeB !== defaultRoute) {
        return asc ? 1 : -1
        // Otherwise, sort based on either depth or free variable priority
      }
      else {
        const slicedA = routeA.split('/') // path.normalize('/' + routeA + '/').split('/').join('/')
        const slicedB = routeB.split('/') // path.normalize('/' + routeB + '/').split('/').join('/')
        const joinedA = slicedA.join('')
        const joinedB = slicedB.join('')
        const depthA = self.optionalParts(slicedA)
        const depthB = self.optionalParts(slicedB)

        // If the start is already alphabetical different
        if (slicedA[1] > slicedB[1]) {
          return asc ? 1 : -1
        }
        if (slicedA[1] < slicedB[1]) {
          return asc ? -1 : 1
        }
        // If the start is alphabetically the same
        if (slicedA[1] === slicedB[1]) {
          // If one has more url parts
          if (depthA > depthB) {
            return asc ? 1 : -1
          }
          if (depthA < depthB) {
            return asc ? -1 : 1
          }
          // They the have the same amount of url parts
          if (depthA === depthB) {
            const weightA = self.freeVariableWeight(joinedA)
            const weightB = self.freeVariableWeight(joinedB)

            if (weightA > weightB) {
              return asc ? -1 : 1
            }
            if (weightA < weightB) {
              return asc ? 1 : -1
            }
            // They have the same weighted score
            if (weightA === weightB) {
              if (joinedA > joinedB) {
                return asc ? 1 : -1
              }
              if (joinedA < joinedB) {
                return asc ? -1 : 1
              }
            }
          }
        }
      }
      return 0
    }
  },

  /**
   * Takes a sliced path and returns an integer representing the
   * "weight" of its free variables. More specific routes are heavier
   *
   * Intuitively: when a free variable is at the base of a path e.g.
   * '/:resource', this is more generic than '/resourceName/:id' and thus has
   * a lower weight
   *
   * Weight can only be used to compare paths of the same depth
   */
  freeVariableWeight: function (sliced) {
    const colMatches = sliced.match(/(:|\{)/gm)
    const optionalMatches = sliced.match(/(\?\})/gm)
    const col = colMatches ? colMatches.length : 0
    const optional = optionalMatches ? optionalMatches.length : 0
    return col - optional
  },

  optionalParts: function(sliced) {
    let count = 0
    sliced.forEach(slice => {
      if (!/\{.*\?\}$/.test(slice)) {
        count = count + 1
      }
      else {
        // count = count
      }
    })
    return count
  }
}
