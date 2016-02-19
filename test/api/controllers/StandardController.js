'use strict'
const Controller = require('trails-controller')

/**
 * @module DefaultController
 *
 * @description Default Controller included with a new Trails app
 * @see {@link http://trailsjs.io/doc/api/controllers}
 * @this TrailsApp
 */
module.exports = class StandardController extends Controller {
  info(request, reply) {
    reply(this.app.services.DefaultService.getApplicationInfo())
  }

  intercept(request, reply) {
    reply(this.app.services.DefaultService.getApplicationInfo())
  }

}
