const _ = require('lodash')
const smokesignals = require('smokesignals')

const Api = require('./api')
const fs = require('fs')
const Joi = require('joi')

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
          database: 'dev',
          storage: './.tmp/dev.sqlite',
          host: '127.0.0.1',
          dialect: 'sqlite'
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
        ignore: ['Ignored'],
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
    main: {
      packs: [
        require('trailpack-sequelize'),
        require('trailpack-footprints'),
        require('trailpack-router'),
        require('../') // trailpack-express
      ]
    },
    routes: [{
      method: 'GET',
      path: '/',
      config: {
        cors: {
          origin: ['http://trailsjs.io']
        }
      },
      handler: 'ViewController.helloWorld'
    }, {
      method: ['GET'],
      path: '/default/notFound',
      handler: 'DefaultController.notFound'
    }, {
      method: ['GET'],
      path: '/default/serverError',
      handler: 'DefaultController.serverError'
    }, {
      method: ['GET'],
      path: '/standard/info',
      handler: 'StandardController.info'
    }, {
      method: ['GET'],
      path: '/standard/intercept',
      handler: 'StandardController.intercept'
    }, {
      method: ['POST', 'PUT'],
      path: '/default/info',
      handler: 'DefaultController.echo'
    }, {
      method: ['GET'],
      path: '/default/info',
      handler: 'DefaultController.info'
    }, {
      method: ['GET'],
      path: '/default/policySuccess',
      handler: 'DefaultController.policySuccess'
    }, {
      method: ['GET'],
      path: '/default/policyFail',
      handler: 'DefaultController.policyFail'
    }, {
      method: ['GET'],
      path: '/default/policyIntercept',
      handler: 'DefaultController.policyIntercept'
    }, {
      method: 'GET',
      path: '/',
      handler: 'ViewController.helloWorld'
    }, {
      method: ['GET'],
      path: '/standard/info',
      handler: 'StandardController.info'
    }, {
      method: ['GET'],
      path: '/standard/intercept',
      handler: 'StandardController.intercept'
    }, {
      method: ['POST', 'PUT'],
      path: '/default/info',
      handler: 'DefaultController.echo'
    }, {
      method: ['GET'],
      path: '/default/info',
      handler: 'DefaultController.info'
    }, {
      method: ['GET'],
      path: '/default/policySuccess',
      handler: 'DefaultController.policySuccess'
    }, {
      method: ['GET'],
      path: '/default/policyFail',
      handler: 'DefaultController.policyFail'
    }, {
      method: ['GET'],
      path: '/default/policyIntercept',
      handler: 'DefaultController.policyIntercept'
    }, {
      method: ['GET'],
      path: '/validation/failHeaders',
      handler: 'ValidationController.fail',
      config: {
        validate: {
          headers: false
        }
      }
    }, {
      method: ['GET'],
      path: '/validation/successHeaders',
      handler: 'ValidationController.success',
      config: {
        validate: {
          headers: true
        }
      }
    }, {
      method: ['GET'],
      path: '/validation/:id/failParams',
      handler: 'ValidationController.fail',
      config: {
        validate: {
          params: false
        }
      }
    }, {
      method: ['GET'],
      path: '/validation/:id/successParams',
      handler: 'ValidationController.success',
      config: {
        validate: {
          params: true
        }
      }
    }, {
      method: ['GET'],
      path: '/validation/failQuery',
      handler: 'ValidationController.fail',
      config: {
        validate: {
          query: false
        }
      }
    }, {
      method: ['GET'],
      path: '/validation/successQuery',
      handler: 'ValidationController.success',
      config: {
        validate: {
          query: true
        }
      }
    }, {
      method: ['POST'],
      path: '/validation/failBody',
      handler: 'ValidationController.fail',
      config: {
        validate: {
          payload: false
        }
      }
    }, {
      method: ['POST'],
      path: '/validation/successBody',
      handler: 'ValidationController.success',
      config: {
        validate: {
          payload: true
        }
      }
    }, {
      method: ['GET', 'POST'],
      path: '/validation/testOrder/:wrongParam',
      handler: 'ValidationController.fail',
      config: {
        validate: {
          headers: Joi.object({
            'requiredheader': Joi.string().required()
          }).options({
            allowUnknown: true
          }),
          query: Joi.object({
            'wrongQuery': Joi.string().required()
          }),
          params: Joi.object({
            'wrongParam': Joi.number().required()
          }),
          payload: Joi.object({
            'wrongPayload': Joi.string().email().required()
          })
        }
      }
    }, {
      method: ['GET', 'POST'],
      path: '/validation/sendRequestData/:numberParam',
      handler: 'ValidationController.sendRequestData',
      config: {
        validate: {
          headers: Joi.object({
            'numberheader': Joi.number()
          }).options({
            allowUnknown: true
          }),
          query: Joi.object({
            number: Joi.number()
          }),
          params: Joi.object({
            numberParam: Joi.number()
          }),
          payload: Joi.object({
            number: Joi.number()
          })
        }
      }
    }, {
      method: 'GET',
      path: '/node_modules',
      handler: {
        directory: {
          path: 'node_modules/trails'
        }
      }
    },{
      method: 'GET',
      path: '/default/routeConfig',
      handler: 'DefaultController.routeConfig',
      config: {
        app: {
          customConfig: true,
          results: 'ok'
        }
      }
    }],
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
      init: (trailsApp, expressApp) => {
        expressApp.initOk = true
      },
      cors: true,
      port: 3030,
      portHttp: 3000,
      ssl: {
        key: fs.readFileSync(process.cwd() + '/test/ssl/server.key'),
        cert: fs.readFileSync(process.cwd() + '/test/ssl/server.crt')
      },
      views: {
        engines: {
          html: 'pug'
        },
        path: 'test/views'
      }
    }
  }
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
