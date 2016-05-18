'use strict'

const _ = require('lodash')

exports.ValidationError = class extends Error {
  constructor(error) {

    super(error)

    // flat all errors for hapi like validation error response
    const flat = error.details.map(details => {
      return {
        key: details.context.key,
        source: details.path.split('.')[0]
      }
    })
    const source = _.uniq(_.flatten(_.map(flat, 'source')))[0]

    error.name = ''
    this.name = error.toString()
    this.error = 'Bad Request'
    this.statusCode = '400'
    delete this.message // weird fix
    this.message = error.details[0].message
    this.validation = {
      key: _.flatten(_.map(flat, 'key')),
      source: source === 'body' ? 'payload' : source
    }
  }
}
