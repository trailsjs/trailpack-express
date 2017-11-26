'use strict'

const npm = require('npm')
const TrailsApp = require('trails')
const pkg = require('../package')
  //Allow self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

before(done => {
  const exVersion = process.env.EXPRESS_VERSION || pkg.devDependencies.express.replace('^', '')

  global.app = new TrailsApp(require('./app'))

  npm.load({
    loaded: false
  }, err => {
    if (err) return done(err)
      // catch errors
    npm.commands.install([`express@${exVersion}`], (err, data) => {
      // log the error or data
      if (err) return done(err)

      global.app.start().then(() => {
        done()
      }).catch(err => {
        global.app.stop().then(() => {
          done(err)
        }).catch(done)
      })
    })
  })
})

after(() => {
  return global.app.stop()
})
