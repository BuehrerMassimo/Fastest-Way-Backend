'use strict'

const fs = require('fs')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { CERTIFICATES } = require('../config/db/index.json')


/**
 * This middleware restricts access to certain routes using the
 * bearer authentication token - the jsonwebtoken scheme is used here
 */
exports.accessTokenRequired = (req, res, next) => {
	const { authorization } = req.headers
	const BEARER = authorization.split(' ')

	if(BEARER.length != 2 || BEARER[0] != 'Bearer') {
		return next( createError(400, 'Bearer Token Required.') )
	}

	const publicSignKey = fs.readFileSync(`${ APPLICATION_ROOT }${ CERTIFICATES.PUBLIC }`)
	jwt.verify(BEARER[1], publicSignKey, function (err, decoded) {
		if (err) return next( createError(401, "Token Verification Failed.") )

		req.token = { payload: decoded }
		return next()
	})
}