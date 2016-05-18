const TrailsApp = require('trails')
global.app = new TrailsApp(require('./app'))
global.app.start()
