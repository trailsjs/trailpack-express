# trailpack-express
:package: Express 4 or 5 Trailpack

This pack binds the routes compiled in [trailpack-router](https://github.com/trailsjs/trailpack-router)
to a [Express Server](http://expressjs.com/en/api.html). 

## Usage
Load in your trailpack config.

```js
// config/main.js
module.exports = {
  // ...
  packs: [
    require('trailpack-core'),
    require('trailpack-router'),
    require('trailpack-express')
  ]
}
```

## Static assets
```js
// config/main.js
module.exports = {
  // ...
  paths: {
    ...
    www: path.resolve(__dirname, '..', 'public')
    ...
  }
}
```

## View Config
Choose a template engine.

```js
// config/views.js
module.exports = {
  engine: 'pug'
}
```

Then simply write your views in a directory called 'views'!

## Configuration

See [`config/web.js`](https://github.com/trailsjs/trailpack-express/blob/master/archetype/config/web.js) for a full example.

#### `express`
Require field to set express version to use by setting `express: require('express')`

#### `port`
The port to listen on. `3000` by default. Can also be set via the `PORT` environment variable.

#### `host`
The hostname of the server.

#### `cache`
The number of seconds to cache flat files on disk being served by Express

#### `ssl`
SSL options (`key`, `cert` or `pfx`) to allow set https protocol

#### `redirectToHttps`
Automatically redirect HTTP request to HTTPS if ssl enabled

#### `portHttp`
The port to listen for http protocol if ssl enabled. If you don't want http and https, don't add this field.

#### `middlewares`
Object to add custom middleware functions to Express, don't forget to add them into `middlewares.order` or they will not be called

## Contributing
We love contributions! In order to be able to review your code efficiently,
please keep the following in mind:

1. Pull Requests (PRs) must include new and/or updated tests, and all tests [must pass](https://travis-ci.org/trailsjs/trailpack-express).
2. Use `eslint`! See the `eslintConfig` in [package.json](https://github.com/trailsjs/trailpack-express/blob/master/package.json).
3. Please [reference the relevant issue](https://github.com/blog/1506-closing-issues-via-pull-requests) in your Pull Request.

## License
[MIT](https://github.com/trailsjs/trailpack-express/blob/master/LICENSE)
