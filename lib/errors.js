'use strict';

const _ = require('lodash');

exports.ValidationError = class extends Error {
  constructor(error) {

    super(error)

    // flat all errors for hapi like validation error response
    const flat = error.details.map(details => {
      return {
        key: _.map(details.context),
        source: details.path.split('.')[0]
      }
    })

    error.name = '';
    this.name = error.toString();
    this.error = 'Bad Request';
    this.statusCode = '400';
    this.validation = {
      key: _.flatten(_.map(flat, 'key')),
      source: _.uniq(_.flatten(_.map(flat, 'source')))[0]
    };
  }
}
