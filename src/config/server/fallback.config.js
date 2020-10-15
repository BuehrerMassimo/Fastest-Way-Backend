'use strict'

const createError = require('http-errors')

module.exports = app => {

	app.use((req, res, next) => {
		next(createError(404, "No endpoint was found for your request."))
	})

	app.use((err, req, res, next) => {
		res.locals.message = err.message
		res.locals.error = err

		return res
		.status(err.status || 500)
		.send({
			error: err.message
		})
	})
	
}