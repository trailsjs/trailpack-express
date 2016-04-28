'use strict'
const Controller = require('trails-controller')
  /**
   * @module DefaultController
   *
   * @description Default Controller included with a new Trails app
   * @see {@link http://trailsjs.io/doc/api/controllers}
   * @this TrailsApp
   */
module.exports = class ValidationController extends Controller {
  fail(req, res) {
    res.status(200).json()
  }
  success(req, res) {
    res.status(200).json()
  }
}
