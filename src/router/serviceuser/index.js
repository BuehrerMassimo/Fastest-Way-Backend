'use strict'

const express = require('express')
const router = express.Router()

const AccessMiddleware = require('../../middleware/access-middleware')
const AuthenticationController = require('../../controller/authentication')


/**
 * 
 */
router.post('/auth', [
	AuthenticationController.authenticateUserAndCreateToken
])

/**
 * 
 */
router.get('/test', [
	AccessMiddleware.accessTokenRequired,
	(req, res, next) => res.send(req.token)
])


module.exports = router