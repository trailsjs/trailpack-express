'use strict'

/**
 * @module DefaultController
 *
 * @description Default Controller included with a new Trails app
 * @see {@link http://trailsjs.io/doc/api/controllers}
 * @this TrailsApp
 */
module.exports = {

  /**
   * Return some info about this application
   */
  info (req, res) {
    res.status(201).json(this.api.services.DefaultService.getApplicationInfo())
  },

  catchAll (req, res) {
    res.status(200).send('<h1>This is the wrong trail</h1>')
  }
}
