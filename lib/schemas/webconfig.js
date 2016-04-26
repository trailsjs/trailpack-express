const joi = require('joi')

module.exports = joi.object().keys({
  express: joi.func().optional(),
  port: joi.number().integer().positive().required(),
  portHttp: joi.number().integer().positive(),
  host: joi.string(),
  ssl: joi.object().keys({
    key: joi.binary(),
    cert: joi.binary(),
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
