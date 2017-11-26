/* eslint no-console: [0] */
'use strict'

const lib = require('./lib')
const _ = require('lodash')
const ServerTrailpack = require('trailpack/server')

/**
 * Express Trailpack
 *
 * @class Express
 * @see {@link http://trailsjs.io/doc/trailpack}
 *
 * Bind application routes to Express.js (from trailpack-router)
 */
module.exports = class Express extends ServerTrailpack {

  /**
   * Ensure that config/web is valid, and that no other competing web
   * server trailpacks are installed (e.g. express)
   */
  async validate () {
    if (_.includes(_.keys(this.app.config.get('main.packs')), 'hapi', 'koa', 'koa2', 'restify')) {
      return Promise.reject(
        new Error('There is another web services trailpack installed that conflicts with trailpack-express!'))
    }
    if (!this.app.config.get('web.express')) {
      return Promise.reject(
        new Error('config.web.express is absent, please npm install your express version (4 or 5) and uncomment the line under config.web.express'))
    }

    // console.log('express',typeof this.app.config.get('web.express'))
    //
    // return Promise.all([
    //   lib.Validator.validateWebConfig(this.app.config.get('web'))
    // ])
  }

  configure () {
    this.app.config.set('web.server', 'express')
  }

  /**
   * Start Express Server
   */
  async initialize () {

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

  unload() {
    if (lib.Server.nativeServer === null) {
      return
    }
    else if (_.isArray(lib.Server.nativeServer)) {
      lib.Server.nativeServer.forEach(server => {
        server.close()
      })
    }
    else {
      lib.Server.nativeServer.close()
    }
  }

  constructor(app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}
