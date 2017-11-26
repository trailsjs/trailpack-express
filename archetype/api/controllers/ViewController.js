'use strict'

const Controller = require('trails/lib/Controller')

module.exports = class ViewController extends Controller {
  helloWorld(req, res) {
    res.status(200).send('Hello Trails.js !')
  }
}
