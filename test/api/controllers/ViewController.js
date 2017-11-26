'use strict'
const Controller = require('trails/lib/Controller')

module.exports = class ViewController extends Controller{
  helloWorld (req, res) {
    res.render('index.pug', {
      title: 'Test',
      message: 'helloWorld'
    })
  }
}
