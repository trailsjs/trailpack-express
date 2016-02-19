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
  middlewares: [],

  /**
   * Middlewares to load for body parsing
   */
  bodyParser: [require('body-parser').json()],

  /**
   * The port to bind the web server to
   */
  port: process.env.PORT || 3000
}
