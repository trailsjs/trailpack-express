'use strict'
const Controller = require('trails-controller')

module.exports = class ViewController extends Controller{
  helloWorld (req, res) {
    res.render('../test/views/index.pug', {
      title: 'Test',
      message: 'helloWorld'
    })
  }
}
