/**
 * Created by jaumard on 16/12/2015.
 */
'use strict'

const _ = require('lodash');
const Express = require('express');
const Consolidate = require('consolidate');

var port
var host
var serverRoutes = {}
var serverHandlers = {}

module.exports = {

	createServer (config) {
		const server = Express();
		port = config.port;
		host = config.host;

		return server
	},

	registerViews (app, server) {
		const viewEngine = app.config.views.engine
		server.set('views', process.cwd()+ '/views');
		server.engine('html', Consolidate[viewEngine])
		server.set('view engine', 'html')
	},

	_mapMethods(methods, handlers){
		handlers.forEach(handler =>{
			let parts = handler.split(".")
			serverHandlers[handler] = methods[parts[0]][parts[1]]
		})
	},

	registerMethods (app, server) {
		const routes = app.routes
		const controllers = app.api.controllers
		const policies = app.api.policies
		const handlers = _.unique(_.pluck(routes, 'handler'))
		const prerequisites = _.unique(_.pluck(_.flatten(_.pluck(routes, 'config.pre')), 'method'))
		this._mapMethods(controllers, handlers)
		this._mapMethods(policies, prerequisites)

		routes.forEach(route => {
			if(route.method instanceof Array){
				route.method.forEach(method =>{
					serverRoutes[method+" "+route.path] = route
				})
			}
			else{
				serverRoutes[route.method+" "+route.path] = route
			}
		})
	},

	registerRoutes (app, server) {
		_.each(app.config.routes, route => {
			if(route.method instanceof Array){
				route.method.forEach(method =>{
					server[method.toLowerCase()](route.path, serverHandlers[route.handler])
				})
			}
			else{
				server[route.method.toLowerCase()](route.path, serverHandlers[route.handler])
			}
		})
	},

	start (server) {
		return new Promise((resolve, reject) => {
			server.listen(port, host, function (err)
			{
				if (err) return reject(err)

				resolve()
			});
		})
	}
}