'use strict';

exports.ValidationError = class extends Error {
  constructor(errors) {
    console.log(errors);
    super(errors.name)
    this.name = 'IllegalAccessError'
    this.message = 'Validation error';
    this.errors = errors;
    this.status = '500';
    this.statusText = 'Internal Server Error';
  }
}
