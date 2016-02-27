'use strict'

const Controller = require('trails-controller')
const Policy = require('trails-policy')

module.exports = {
  isTrailsStandard: function(obj) {
    const className = obj.constructor.name
    if (className == Controller.name || className == Policy.name) {
      return true
    }
    else if (className == 'Object') {
      return false
    }
    else {
      return this.isTrailsStandard(obj.__proto__)
    }
  },
  /**
   * Transform express4 request to hapi like request
   * @param req as express4
   * @param res as express4
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
   * Transform express4 response to hapi like response
   * @param req as express4
   * @param res as express4
   * @param next as express4
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
  }
}
