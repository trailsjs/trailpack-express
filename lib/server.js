/**
 * Created by jaumard on 16/12/2015.
 */
'use strict'

const _ = require('lodash')
const express = require('express')
//const utils = require('./utils')
const path = require('path')
const consolidate = require('consolidate')
const expressBoom = require('express-boom')

module.exports = {
  port: null,
  host: null,
  nativeServer: null,
  serverRoutes: {},
  serverPolicies: {},
  serverHandlers: {},

  createServer (app) {
    const config = app.config
    const server = express()
    this.port = config.web.port
    this.host = config.web.host

    if (config.main.paths && config.main.paths.www) {
      server.use(express.static(config.main.paths.www))
    }
    else {
      app.log.info('config.paths.www: No www directory is set')
    }

    if (_.isArray(config.web.bodyParser)) {
      for (const index in config.web.bodyParser) {
        server.use(config.web.bodyParser[index])
      }
    }
    else {
      server.use(config.web.bodyParser)
    }

    server.use(expressBoom())

    for (const index in config.web.middlewares) {
      server.use(config.web.middlewares[index])
    }

    return server
  },

  /**
   * Add 404 and 500 handler
   * @param server express server
   * @param app Trails app
   */
  addErrorHandlers (app, server) {
    server.use((req, res, next) => {
      res.status(404)

      // respond with html page
      if (req.accepts('html')) {
        res.render('404', { url: req.url }, (err, html) => {
          if (err) {
            app.config.log.logger.error('Error sending page 404', err)
            res.type('txt').send('Not found')
          }
          else {
            res.send(html)
          }
        })
      }
      // respond with json
      else if (req.accepts('json')) {
        res.send({ error: 'Not found' })
      }
      else {
        // default to plain-text. send()
        res.type('txt').send('Not found')
      }
    })
    server.use(function(error, req, res, next) {
      res.status(500)

      // respond with html page
      if (req.accepts('html')) {
        res.render('500', { url: req.url, error: error }, (err, html) => {
          if (err) {
            app.config.log.logger.error('Error sending page 500', err)
            res.type('txt').send('Internal Server Error')
          }
          else {
            res.send(html)
          }
        })
      }
      // respond with json
      else if (req.accepts('json')) {
        res.send({ error: error })
      }
      // default to plain-text. send()
      else {
        res.type('txt').send('Internal Server Error')
      }
    })
  },

  /**
   * Register template engines and views path
   * @param server express server
   * @param app Trails app
   */
  registerViews (app, server) {
    const viewEngine = app.config.views ? app.config.views.engine : null
    const viewEngines = app.config.web.views

    if (!viewEngine && !viewEngines) {
      app.log.info('No view engine is set')
      return
    }

    if (viewEngines) {
      let defaultExt
      for (const ext in viewEngines.engines) {
        if (!defaultExt) {
          defaultExt = ext
        }
        server.engine(ext, consolidate[viewEngines.engines[ext]])
      }

      if (defaultExt) {
        server.set('view engine', defaultExt)
      }

      server.set('views', path.join(process.cwd(), viewEngines.path))
    }
    else {
      server.engine('html', consolidate[viewEngine] ? consolidate[viewEngine] : viewEngine)
      server.set('view engine', 'html')
      server.set('views', path.join(process.cwd(), 'views'))
    }
  },

  /*
  mapMethods(methods, handlers){
    handlers.forEach(handler => {
      const parts = handler.split('.')
      if (utils.isTrailsStandard(methods[parts[0]].__proto__)) {
        this.serverHandlers[handler] = function(req, res, next) {
          const request = utils.createRequest(req, res)
          const response = utils.createResponse(request, res, next)

          if (handler.indexOf('Standard') == -1 && handler.indexOf('Swagger') == -1) {//FIXME: remove this for final deployment
            methods[parts[0]][parts[1]](req, res, next)
          }
          else {
            methods[parts[0]][parts[1]](request, response)
          }
        }
      }
      else {
        this.serverHandlers[handler] = methods[parts[0]][parts[1]]
      }
    })
  },

  registerMethods (app, server) {

    const controllers = app.controllers
    const policies = app.policies
    const handlers = _.uniq(_.map(routes, 'handler'))
    const prerequisites = _.uniq(_.map(_.flatten(_.map(routes, 'config.pre')), 'method'))
    this.mapMethods(controllers, handlers)
    this.mapMethods(policies, prerequisites)

    _.each(app.config.policies, (policy, controllerId) => {
      _.each(policy, (handlers, methodId) => {
        const id = controllerId + '.' + methodId
        if (handlers instanceof Array) {
          this.serverPolicies[id] = []
          handlers.forEach(h => {
            this.serverPolicies[id].push(this.serverHandlers[h])
          })
        }
        else {
          this.serverPolicies[id] = [this.serverHandlers[handlers]]
        }
      })
    })
  },*/

  /**
   * Register routes to express server
   * @param server express server
   * @param app Trails app
   */
  registerRoutes (app, server) {
    const routes = app.routes.reverse()//reverse routes to have parametrized routes first

    routes.forEach(route => {
      if (route.method == '*')route.method = 'ALL'

      if (route.method instanceof Array) {
        route.method.forEach(method => {
          this.serverRoutes[method.toLowerCase() + ' ' + route.path] = route
        })
      }
      else {
        this.serverRoutes[route.method.toLowerCase() + ' ' + route.path] = route
      }
    })

    _.each(this.serverRoutes, (route, path) => {

      const parts = path.split(' ')

      let methods = []
      if (route.config && route.config.pre && route.config.pre.length > 0) {
        methods = methods.concat(route.config.pre)
      }

      methods.push(route.handler)
      methods.unshift(route.path.replace(/{/g, ':').replace(/}/g, ''))//FIXME: Format route to express4 protocol, maybe `trailpack-router` can do this

      server[parts[0]].apply(server, methods)
    })
    this.addErrorHandlers(app, server)
  },

  /**
   * Start express server
   * @param server express server
   */
  start (server) {
    return new Promise((resolve, reject) => {
      this.nativeServer = server.listen(this.port, this.host, function(err) {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
