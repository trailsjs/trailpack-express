const _ = require('lodash')
const smokesignals = require('smokesignals')

const Api = require('./api')

const AppConfigLocales = {
  en: {
    helloworld: 'hello world'
  }
}

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
      controllers: false,
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
      prefix: '/api/v1'
    },
    i18n: {
      lng: 'en',
      resources: {
        en: {
          translation: AppConfigLocales.en
        }
      }
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
      }
    },
    web: {port: 3000},
    views: {engine: 'jade'}
  }
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
