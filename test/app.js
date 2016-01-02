const _ = require('lodash')
const smokesignals = require('smokesignals')

const Api = require('./api')

const App = {
  pkg: {
    name: 'express4-trailpack-test',
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
      controllers: true,
      models: {
        options: {
          defaultLimit: 100,
          watch: false,
          populate: false
        },

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
      prefix: '/api/v1'
    },
    i18n: {
      lng: 'en'
    },
    main: {
      packs: [
        smokesignals.Trailpack,
        require('trailpack-core'),
        require('trailpack-waterline'),
        require('trailpack-router'),
        require('../') // trailpack-express4
      ]
    },
    routes: [
      {
        method: 'GET',
        path: '/',
        handler: 'ViewController.helloWorld'
      },
      {
        method: ['POST', 'PUT'],
        path: '/api/v1/default/info',
        handler: 'DefaultController.echo'
      }
    ],
    policies: {
      DefaultController: {
        policyFail: ['Default.fail'],
        policySuccess: ['Default.success'],
        policyIntercept: ['Default.intercept']
      }
    },
    web: {port: 3000},
    views: {engine: 'jade'}
  }
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
