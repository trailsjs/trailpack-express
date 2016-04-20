/**
 * Created by jaumard on 16/12/2015.
 */
'use strict'

const lib = require('./lib')
const _ = require('lodash')
const WebServerTrailpack = require('trailpack-webserver')

/**
 * Express4 Trailpack
 *
 * @class Express4
 * @see {@link http://trailsjs.io/doc/trailpack
 *
 * Bind application routes to Express4.js (from trailpack-router)
 */
module.exports = class Express4 extends WebServerTrailpack {

  /**
   * Ensure that config/web is valid, and that no other competing web
   * server trailpacks are installed (e.g. express)
   */
  validate () {
    if (_.includes(_.keys(this.app.config.main.packs), 'express4', 'koa', 'koa2', 'restify')) {
      return Promise.reject(new Error('There is another web services trailpack installed that conflicts with trailpack-express4!'))
    }

    return Promise.all([
      lib.Validator.validateWebConfig(this.app.config.web)
    ])
  }

  configure () {
    this.app.config.web.server = 'express4'
  }

  /**
   * Start Express4 Server
   */
  initialize () {
    this.server = lib.Server.createServer(this.app)

    return Promise.all([
      lib.Server.registerMiddlewares(this.app, this.server),
      lib.Server.registerViews(this.app, this.server)
    ])
      .then(() => {
        return lib.Server.start(this.app, this.server)
      })
      .then(() => {
        this.app.emit('webserver:http:ready', lib.Server.nativeServer)
      })
  }

  constructor (app, config) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}
