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
  validate() {
    if (_.includes(_.keys(this.app.config.main.packs), 'express4', 'koa', 'koa2', 'restify')) {
      return Promise.reject(new Error('There is another web services trailpack installed that conflicts with trailpack-hapi!'))
    }

    return Promise.all([
      lib.Validator.validateWebConfig(this.app.config.web)
    ])
  }

  configure() {
    this.app.config.web.server = 'express4'
  }

  /**
   * Start Express4 Server
   */
  initialize() {
    const server = lib.Server.createServer(this.app)

    return Promise.all([
      lib.Server.registerMethods(this.app, server),
      lib.Server.registerRoutes(this.app, server),
      lib.Server.registerViews(this.app, server)
    ])
      .then(() => {
        return lib.Server.start(server)
      })
      .then(() => {
        this.app.emit('webserver:http:ready', lib.Server.nativeServer)
      })
  }

  constructor(app, config) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }

}
