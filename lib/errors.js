'use strict';

exports.ValidationError = class extends Error {
  constructor(errors) {

    super(errors.name)
    this.name = 'IllegalAccessError'
    this.message = 'Validation error';
    this.errors = errors;
    this.status = '400';
    this.statusText = 'Internal Server Error';
  }
}
