'use strict'

const serviceUserRouter = require('./serviceuser')


module.exports = app => {

	app.use('/user', serviceUserRouter)

}