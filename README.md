# trailpack-express4
:package: Express 4 Trailpack

This pack binds the routes compiled in [trailpack-router](https://github.com/trailsjs/trailpack-router)
to a [Express4 Server](http://expressjs.com/en/api.html). 

## Usage
Load in your trailpack config.

```js
// config/trailpack.js
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

Then simply write your views in a directory called 'templates'!

This feature has been tested with Jade and Handlebars. TODO: Put this in yeoman?

## Configuration
See [`config/web.js`](https://github.com/trailsjs/trails-example-app/blob/master/config/web.js) for an example.

#### `port`
The port to listen on. `3000` by default. Can also be set via the `PORT` environment variable.

## Contributing
We love contributions! In order to be able to review your code efficiently,
please keep the following in mind:

1. Pull Requests (PRs) must include new and/or updated tests, and all tests [must pass](https://travis-ci.org/trailsjs/trailpack-express4).
2. Use `eslint`! See the `eslintConfig` in [package.json](https://github.com/trailsjs/trailpack-express4/blob/master/package.json).
3. Please [reference the relevant issue](https://github.com/blog/1506-closing-issues-via-pull-requests) in your Pull Request.

## License
[MIT](https://github.com/trailsjs/trailpack-express4/blob/master/LICENSE)
