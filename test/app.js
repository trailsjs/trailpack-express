const _ = require('lodash')
const smokesignals = require('smokesignals')

const Api = require('./api')
const fs = require('fs')

const App = {
  pkg: {
    name: 'express-trailpack-test',
    version: '1.0.0'
  },
  api: Api,
  config: {
    database: {
      stores: {
        sqlitedev: {
          adapter: require('waterline-sqlite3')
        }
      },
      models: {
        defaultStore: 'sqlitedev',
        migrate: 'drop'
      }
    },
    footprints: {
      controllers: {
        ignore: ['DefaultController', 'ViewController', 'StandardController']
      },
      models: {

        actions: {
          create: true,
          createWithId: true,
          find: true,
          findOne: true,
          update: true,
          destroy: true,

          createAssociation: true,
          createAssociationWithId: true,
          findAssociation: true,
          findOneAssociation: true,
          updateAssociation: true,
          destroyAssociation: true
        }
      },
      prefix: ''
    },
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-core'),
        require('trailpack-waterline'),
        require('trailpack-footprints'),
        require('trailpack-router'),
        require('../') // trailpack-express
      ]
    },
    routes: [
      {
        method: 'GET',
        path: '/',
        handler: 'ViewController.helloWorld'
      },
      {
        method: ['GET'],
        path: '/standard/info',
        handler: 'StandardController.info'
      },
      {
        method: ['GET'],
        path: '/standard/intercept',
        handler: 'StandardController.intercept'
      },
      {
        method: ['POST', 'PUT'],
        path: '/default/info',
        handler: 'DefaultController.echo'
      },
      {
        method: ['GET'],
        path: '/default/info',
        handler: 'DefaultController.info'
      },
      {
        method: ['GET'],
        path: '/default/policySuccess',
        handler: 'DefaultController.policySuccess'
      },
      {
        method: ['GET'],
        path: '/default/policyFail',
        handler: 'DefaultController.policyFail'
      },
      {
        method: ['GET'],
        path: '/default/policyIntercept',
        handler: 'DefaultController.policyIntercept'
      }
    ],
    policies: {
      DefaultController: {
        policyFail: ['Default.fail'],
        policySuccess: ['Default.success'],
        policyIntercept: ['Default.intercept']
      },
      StandardController: {
        info: ['Standard.continue'],
        intercept: ['Standard.fail']
      }
    },
    web: {
      express: require('express'),
      port: 3030,
      portHttp: 3000,
      ssl: {
        key: fs.readFileSync(process.cwd() + '/test/ssl/server.key'),
        cert: fs.readFileSync(process.cwd() + '/test/ssl/server.crt')
      },
      views: {
        engines: {
          html: 'jade'
        },
        path: 'views'
      }
    }
  }
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
