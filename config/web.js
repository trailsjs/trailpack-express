'use strict'

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const compression = require('compression')

/**
 * Server Configuration
 * (app.config.web)
 *
 * Configure the Web Server
 *
 * @see {@link http://trailsjs.io/doc/config/web}
 */
module.exports = {
  /**
   * Middlewares to load (in order)
   */
  middlewares: {
    compression: compression(),
    methodOverride: methodOverride('_method'),
    cookieParser: cookieParser(),
    '404': (req, res, next) => {
      res.status(404)

      // respond with html page
      if (req.accepts('html') && req.app.get('view engine')) {
        res.render('404', {url: req.url}, (err, html) => {
          if (err) {
            req.log.error('Error sending page 404, maybe you don\'t have a 404.html file', err)
            res.type('txt').send('Resource not found')
          }
          else {
            res.send(html)
          }
        })
      }
      // respond with json
      else if (req.wantsJSON) {
        res.send({error: 'Not found'})
      }
      else {
        // default to plain-text. send()
        res.type('txt').send('Not found')
      }
    },
    '500': (error, req, res, next) => {
      res.status(500)
      error = error || 'Internal Server Error'
      req.log.error(error)
      // respond with html page
      if (req.accepts('html') && req.app.get('view engine') && !req.wantsJSON) {
        res.render('500', {url: req.url, error: error}, (err, html) => {
          if (err) {
            req.log.error('Error sending page 500, maybe you don\'t have a 500.html file', err)
            res.type('txt').send('Internal Server Error')
          }
          else {
            res.send(html)
          }
        })
      }
      // respond with json
      else if (req.wantsJSON) {
        res.send({error: error})
      }
      // default to plain-text. send()
      else {
        res.type('txt').send('Internal Server Error')
      }
    },
    order: [
      'addMethods',
      'cookieParser',
      'session',
      'bodyParser',
      'compression',
      'methodOverride',
      'www',
      'router',
      '404',
      '500'
    ],
    /**
     * Middlewares to load for body parsing
     */
    bodyParser: [
      bodyParser.json(),
      bodyParser.urlencoded({extended: false})
    ]
  },

  /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

  cache: 31557600000,

  /**
   * The host to bind the web server to
   */
  host: process.env.HOST || 'localhost',

  /**
   * The port to bind the web server to
   */
  port: process.env.PORT || 3000
}
