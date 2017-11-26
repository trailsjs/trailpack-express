'use strict'
const Service = require('trails/lib/Service')
  /**
   * @module DefaultService
   *
   * @description Default Service included with a new Trails app
   * @see {@link http://trailsjs.io/doc/api/services}
   * @this TrailsApp
   */
module.exports = class DefaultService extends Service {

  /**
   * Return some info about this application
   */
  getApplicationInfo() {
    return {
      app: this.app.pkg.version
    }
  }
}
