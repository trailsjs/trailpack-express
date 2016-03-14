# trailpack-express4
:package: Express 4 Trailpack

This pack binds the routes compiled in [trailpack-router](https://github.com/trailsjs/trailpack-router)
to a [Express4 Server](http://expressjs.com/en/api.html). 

## Usage
Load in your trailpack config.

```js
// config/main.js
module.exports = {
  // ...
  packs: [
    require('trailpack-core'),
    require('trailpack-router'),
    require('trailpack-express4')
  ]
}
```

## View Config
Choose a template engine.

```js
// config/views.js
module.exports = {
  engine: 'jade'
}
```

Then simply write your views in a directory called 'views'!

## Configuration

```js
// config/web.js

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
  port: process.env.PORT || 3000,

  /**
   * Alternate method to add multiple template engine, for single view template use config.view.engine
   */
  /*
  views: {
    engines: {
      // html: require('some-view-engine')
    },
    path: 'views'
  },
  */

  /**
   * SSL options
   * Cert and key or pfx to add to create HTTPS server
   * @redirectToHttps
   */
  /*
  ssl: {
    key: fs.readFileSync('path/to/private.key'),
    cert: fs.readFileSync('path/to/certificate.pem')
    //OR pfx: fs.readFileSync('path/to/server.pfx')
  },
   */
  /**
   * Automatically redirect HTTP to HTTPS
   * Create an HTTP server who redirect to HTTPS server
   * Work only if SSL is enabled
   */
  //redirectToHttps: false,

  /**
   * Http port to use if redirectToHttps is enabled, port use for https server
   */
  //portHttp: 80
}
```

## Contributing
We love contributions! In order to be able to review your code efficiently,
please keep the following in mind:

1. Pull Requests (PRs) must include new and/or updated tests, and all tests [must pass](https://travis-ci.org/trailsjs/trailpack-express4).
2. Use `eslint`! See the `eslintConfig` in [package.json](https://github.com/trailsjs/trailpack-express4/blob/master/package.json).
3. Please [reference the relevant issue](https://github.com/blog/1506-closing-issues-via-pull-requests) in your Pull Request.

## License
[MIT](https://github.com/trailsjs/trailpack-express4/blob/master/LICENSE)
