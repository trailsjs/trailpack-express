const joi = require('joi')

module.exports = joi.object().keys({
  baseUrl: joi.string(),
  express: joi.func().required(),
  cors: [joi.boolean(), joi.func(), joi.object()],
  port: joi.number().integer().positive().required(),
  portHttp: joi.number().integer().positive().when('redirectToHttps', { is: true, then: joi.required() }),
  host: joi.string(),
  init: joi.func(),
  ssl: joi.object().keys({
    key: joi.binary(),
    cert: joi.binary(),
    passphrase: joi.string(),
    pfx: joi.binary()
  }).without('pfx', ['key', 'cert']).and('key', 'cert'),
  redirectToHttps: joi.bool(),
  middlewares: joi.object().keys({
    order: joi.array().required()
  }).unknown(),
  cache: joi.number().integer().min(0),
  views: joi.object().keys({
    engines: joi.object().required(),
    path: joi.string().required()
  }),
  server: joi.string()
})
