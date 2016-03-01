
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

    /*
    //middlewares loading order
    order: [
      'addMethods',
      'cookieParser',
      'bodyParser',
      'methodOverride',
      'router',
      'www',
      '404',
      '500'
    ]*/

    /**
     * Middlewares to load for body parsing
    bodyParser: [
      bodyParser.json(),
      bodyParser.urlencoded({extended: false})
    ]
     */

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
   * The port to bind the web server to
   */
  port: process.env.PORT || 3000
}
