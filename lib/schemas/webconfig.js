const joi = require('joi')

module.exports = joi.object().keys({
  port: joi.number().integer().positive().required(),
  host: joi.string(),
  middlewares: joi.array().optional(),
  bodyParser: joi.array().optional(),
  views: joi.object().keys({
    engines: joi.object().required(),
    path: joi.string().required()
  }).optional()
})
