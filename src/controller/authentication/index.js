'use strict'

const { ServiceUser } = require('../../data/models')
const createError = require('http-errors')


/**
 * This method will authenticate a user and create a token if the
 * user has submitted the right credentials
 */
exports.authenticateUserAndCreateToken = (req, res, next) => {
	const { email, password } = req.body

	ServiceUser.findOne({ email }, function (err, user) {
		if (err) return next(err)
		if (user == null) return next( createError(404, "No User was found with these credentials.") )
		
		user.comparePassword(password, function (err, passwordsMatched) {
			if (err) return next(err)
			if (!passwordsMatched) return next( createError(401, "Credentials do not fit") )

			return res
			.status(200)
			.set('Content-Type', 'application/json')
			.send({
				token: user.createUserAccessToken()
			})
		})
	})
}