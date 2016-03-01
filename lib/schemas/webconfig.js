const joi = require('joi')

module.exports = joi.object().keys({
  port: joi.number().integer().positive().required(),
  host: joi.string(),
  middlewares: joi.object().keys({
    order: joi.array().required()
  }).unknown().optional(),
  cache: joi.number().integer().min(0).optional(),
  views: joi.object().keys({
    engines: joi.object().required(),
    path: joi.string().required()
  }).optional()
})
