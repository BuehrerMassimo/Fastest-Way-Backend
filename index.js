'use strict'

const SERVER_CONFIG = require('./src/config/server/index.json')
const express = require('express')
const http = require('http')
const path = require('path')


/** GLOBALS */
global.APPLICATION_ROOT = path.resolve(__dirname)

/** Main Application */
const app = express()

/** Application & Database configurations */
require('./src/config/server/settings.config')(app)
require('./src/data')()
require('./src/router')(app)
require('./src/config/server/fallback.config')(app)

/** Port */
const port = process.env.PORT || SERVER_CONFIG.PORT
app.set('port', port)

/** Create a server */
const server = http.createServer(app)

/** Listen on port */
server.listen(port)

/** Error listener */
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
	}

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
		: 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
})


server.on('listening', () => {
	console.log(`Listening on http://localhost:${port}`)
})