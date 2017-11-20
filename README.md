# trailpack-express
:package: Express Trailpack

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Linux + OSX Build Status][ci-image]][ci-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Follow @trailsjs on Twitter][twitter-image]][twitter-url]

This pack binds the routes compiled in [trailpack-router](https://github.com/trailsjs/trailpack-router)
to an [Express Server](http://expressjs.com/en/api.html). 

## Install

```
$ npm install --save trailpack-express
```

## Compatibility

This Trailpack is compatible with Express [v4](http://expressjs.com/en/4x/api.html) and [v5](https://github.com/expressjs/express/tree/5.0).

#### Express v4

```
$ npm install --save express@^4
```

#### Express v5

```
$ npm install --save express@^5.0.0-alpha.2
```

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

#### `cors`
Optional field to configure CORS, can be a boolean or an object (see https://github.com/expressjs/cors#configuring-cors)

#### `port`
The port to listen on. `3000` by default. Can also be set via the `PORT` environment variable.

#### `host`
The hostname of the server.

#### `cache`
The number of seconds to cache flat files on disk being served by Express

#### `letsencrypt`
letsencrypt option for greenlock (see https://git.daplie.com/Daplie/node-greenlock) for more information

#### `ssl`
SSL options (`key`, `cert` or `pfx`) to allow set https protocol

#### `redirectToHttps`
Automatically redirect HTTP request to HTTPS if ssl enabled

#### `portHttp`
The port to listen for http protocol if ssl enabled. If you don't want http and https, don't add this field.

#### `middlewares`
Object to add custom middleware functions to Express, don't forget to add them into `middlewares.order` or they will not be called

### `init`
Method to customize express instance

## Contributing
We love contributions! Please check out our [Contributor's Guide](https://github.com/trailsjs/trails/blob/master/.github/CONTRIBUTING.md) for more
information on how our projects are organized and how to get started.

## License
[MIT](https://github.com/trailsjs/trailpack-express/blob/master/LICENSE)

[trails-image]: http://i.imgur.com/zfT2NEv.png
[trails-url]: http://trailsjs.io
[npm-image]: https://img.shields.io/npm/v/trailpack-express.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-express
[ci-image]: https://img.shields.io/travis/trailsjs/trailpack-express.svg?style=flat-square&label=Linux%20/%20OSX
[ci-url]: https://travis-ci.org/trailsjs/trailpack-express
[appveyor-image]: https://img.shields.io/appveyor/ci/trailsjs/trailpack-express/master.svg?style=flat-square&label=Windows
[appveyor-url]: https://ci.appveyor.com/project/trailsjs/trailpack-express
[codeclimate-image]: https://img.shields.io/codeclimate/github/trailsjs/trailpack-express.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/trailsjs/trailpack-express
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/trailsjs/trails
[twitter-image]: https://img.shields.io/twitter/follow/trailsjs.svg?style=social
[twitter-url]: https://twitter.com/trailsjs
