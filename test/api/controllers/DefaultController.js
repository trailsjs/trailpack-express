'use strict'
const Controller = require('trails/lib/Controller')
/**
   * @module DefaultController
   *
   * @description Default Controller included with a new Trails app
   * @see {@link http://trailsjs.io/doc/api/controllers}
   * @this TrailsApp
   */
module.exports = class DefaultController extends Controller {
  notFound(req, res) {
    res.notFound()
  }
  serverError(req, res) {
    res.serverError()
  }
  info(req, res) {
    res.status(200).json(this.app.services.DefaultService.getApplicationInfo())
  }
  policySuccess(req, res) {
    res.status(200).json(this.app.services.DefaultService.getApplicationInfo())
  }
  policyFail(req, res) {
    res.status(200).json(this.app.services.DefaultService.getApplicationInfo())
  }
  policyIntercept(req, res) {
    res.status(200).json(this.app.services.DefaultService.getApplicationInfo())
  }
  echo(req, res) {
    res.status(200).json(req.body)
  }
  routeConfig(req, res) {
    res.status(200).json(req.route.config)
  }
}
