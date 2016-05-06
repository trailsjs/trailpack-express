/**
 * Created by jaumard on 16/12/2015.
 */
'use strict'

const _ = require('lodash')
const path = require('path')
const session = require('express-session')
const consolidate = require('consolidate')
const expressBoom = require('express-boom')
const http = require('http')
const https = require('https')

module.exports = {
  port: null,
  host: null,
  ssl: null,
  redirectToHttps: false,
  nativeServer: null,
  serverRoutes: {},
  serverPolicies: {},
  serverHandlers: {},
  webConfig: {},

  createServer (app) {
    const config = app.config
    const express = app.config.web.express
    const server = express()
    this.webConfig = _.cloneDeep(app.config.web)
    this.port = this.webConfig.port
    this.portHttp = this.webConfig.portHttp
    this.host = this.webConfig.host
    this.ssl = this.webConfig.ssl
    this.redirectToHttps = this.webConfig.redirectToHttps || false

    if (config.main.paths && config.main.paths.www) {
      this.webConfig.middlewares.www = express.static(config.main.paths.www, {maxAge: this.webConfig.cache})
    }
    else {
      app.log.info('config.paths.www: No www directory is set, www middleware will not be loaded')
    }

    if (config.session && config.session.secret) {
      this.webConfig.middlewares.session = session({
        secret: config.session.secret,
        resave: true,
        saveUninitialized: false
      })
    }
    else {
      app.log.info('config.session.secret: No secret given so session are disabled')
    }

    if (!this.webConfig.middlewares.addMethods) {
      this.webConfig.middlewares.addMethods = (req, res, next) => {
        req.log = app.log
        req.wantsJSON = /application\/json/.test(req.get('accept'))
        res.serverError = this.webConfig.middlewares['500']
        res.notFound = this.webConfig.middlewares['404']

        next()
      }
    }

    return server
  },
  /**
   * Register middlewares
   * @param server express server
   * @param app Trails app
   */
  registerMiddlewares (app, server){
    server.use(expressBoom())
    for (const index in this.webConfig.middlewares.order) {
      const middlewareName = this.webConfig.middlewares.order[index]
      const middleware = this.webConfig.middlewares[middlewareName]
      if (!middleware && middlewareName != 'router') continue

      if (_.isArray(middleware)) {
        for (const i in middleware) {
          const m = middleware[i]
          server.use(m)
        }
      }
      else if (middlewareName == 'router') {
        this.registerRoutes(app, server)
      }
      else if (middleware) {
        server.use(middleware)
      }

    }
  },

  /**
   * Register template engines and views path
   * @param server express server
   * @param app Trails app
   */
  registerViews (app, server) {
    const viewEngine = app.config.views ? app.config.views.engine : null
    const viewEngines = this.webConfig.views

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

    if (this.ssl && this.redirectToHttps) {
      server.all('*', (req, res, next) => {
        if (req.secure) {
          return next()
        }
        res.redirect('https://' + req.hostname + ':' + this.port + req.url)
      })
    }

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
      methods.unshift(route.path.replace(/{/g, ':').replace(/}/g, ''))//FIXME: Format route to express protocol, maybe `trailpack-router` can do this

      server[parts[0]].apply(server, methods)
    })

  },

  /**
   * Start express server
   * @param server express server
   * @param app Trails application
   */
  start (app, server) {
    return new Promise((resolve, reject) => {

      if (this.ssl) {
        this.nativeServer = https.createServer(this.ssl, server)
          .listen(this.port, this.host, (err) => {
            if (err) return reject(err)
            if (this.redirectToHttps || this.portHttp) {
              const httpServer = http.createServer(server).listen(this.portHttp, this.host, (err) => {
                if (err) return reject(err)
                this.nativeServer = [this.nativeServer, httpServer]
                resolve()
              })
            }
            else {
              resolve()
            }
          })

      }
      else {
        this.nativeServer = http.createServer(server).listen(this.port, this.host, (err) => {
          if (err) return reject(err)
          resolve()
        })
      }
    })
  }
}
