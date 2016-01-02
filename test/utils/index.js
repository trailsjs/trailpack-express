'use strict'

const http = require('http')

module.exports = {
  request(method, path, params, next){

    const options = {
      host: 'localhost',
      path: path,
      port: '3000',
      method: method
    }

    if (method == 'POST' || method == 'PUT') {
      options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    const callback = function (response) {
      let str = ''
      response.on('data', function (chunk) {
        str += chunk
      })

      response.on('end', function () {
        if (response.statusCode == 201 || response.statusCode == 200) {
          next(null, str)
        }
        else {
          const error = new Error(str)
          error.http_code = response.statusCode
          next(error)
        }
      })
    }

    const req = http.request(options, callback)

    if (method == 'POST' || method == 'PUT') {
      req.write(JSON.stringify(params))
    }

    req.on('error', function (e) {
      next(e)
    })

    req.on('timeout', function () {
      req.abort()
      next(new Error('Timeout'))
    })
    req.end()
  }
}
