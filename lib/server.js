/**
 * Created by jaumard on 16/12/2015.
 */
'use strict'

const _ = require('lodash')
const express = require('express')
const expressBodyParser = require('body-parser')
const consolidate = require('consolidate')

let port
let host
const serverRoutes = {}
const serverPolicies = {}
const serverHandlers = {}

module.exports = {

  createServer (config) {
    const server = express()
    port = config.port
    host = config.host
    server.use(express.static('.tmp/public')) //FIXME: need to change this and get output directory from app config
    server.use(expressBodyParser.urlencoded({extended: false}));
    server.use(expressBodyParser.json());
    return server
  },

  registerViews (app, server) {
    const viewEngine = app.config.views.engine
    server.set('views', process.cwd() + '/views')

    server.engine('html', consolidate[viewEngine])
    server.set('view engine', 'html')
  },

  mapMethods(methods, handlers){
    handlers.forEach(handler => {
      const parts = handler.split('.')
      serverHandlers[handler] = methods[parts[0]][parts[1]]
    })
  },

  registerMethods (app, server) {
    const routes = app.routes
    const controllers = app.api.controllers
    const policies = app.api.policies
    const handlers = _.unique(_.pluck(routes, 'handler'))
    const prerequisites = _.unique(_.pluck(_.flatten(_.pluck(routes, 'config.pre')), 'method'))
    this.mapMethods(controllers, handlers)
    this.mapMethods(policies, prerequisites)

    routes.forEach(route => {
      if (route.method == '*')route.method = "ALL"

      if (route.method instanceof Array) {
        route.method.forEach(method => {
          serverRoutes[method + ' ' + route.path] = route
        })
      }
      else {
        serverRoutes[route.method + ' ' + route.path] = route
      }
    })

    _.each(app.config.policies, (_policy, controllerId) => {
      _.each(_policy, (_handlers, _methodId) => {
        const id = controllerId + '.' + _methodId
        if (_handlers instanceof Array) {
          serverPolicies[id] = []
          _handlers.forEach(h => {
            serverPolicies[id].push(serverHandlers[h])
          })
        }
        else {
          serverPolicies[id] = [serverHandlers[_handlers]]
        }
      })
    })
  },

  registerRoutes (app, server) {
    _.each(serverRoutes, (route, path) => {

      const parts = path.split(' ')
      if (parts[0].toLowerCase() == 'patch')return

      let methods = []
      if (serverPolicies[route.handler]) {
        methods = methods.concat(serverPolicies[route.handler].slice())
      }
      methods.push(serverHandlers[route.handler])
      methods.unshift(route.path)

      server[parts[0].toLowerCase()].apply(server, methods)
    })
  },

  start (server) {
    return new Promise((resolve, reject) => {
      server.listen(port, host, function (err) {
        if (err) return reject(err)

        resolve()
      });
    })
  }
}
