'use strict';

function ValidationError (errors, options) {
  this.message = 'Validation error';
  this.errors = errors;
  this.status = '500';
  this.statusText = 'Internal Server Error';
};
ValidationError.prototype = Object.create(Error.prototype);

ValidationError.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};

ValidationError.prototype.toJSON = function () {
  return {
    status: this.status,
    statusText: this.statusText,
    errors: this.errors
  };
};

module.exports = ValidationError;
