'use strict'

const { expect } = require('chai')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const AccessMiddleware = require('../../src/middleware/access-middleware')


describe('Access Middleware', () => {
	const privateSignKey = fs.readFileSync('src/config/certificates/jwt_private_key.pem')
	const fakePrivateSignKey = fs.readFileSync('test/env/fake_private_key.pem')
	const testTokenPayload = {
		data: {
			userID: 5,
			name: "Max Mustermann"
		}
	}
	let req = {
		headers: {}
	}

	/**
	 * Prepare global
	 */
	before(() => global.APPLICATION_ROOT = '.')

	/**
	 * Testing for a valid signed bearer token
	 */
	it('Valid Bearer Token gets verified properly', () => {
		const testToken = jwt.sign(
			testTokenPayload,
			privateSignKey, {
			algorithm: "RS256",
			expiresIn: 60 * 10 // active for 10 minutes
		})
		
		req.headers.authorization = `Bearer ${testToken}`

		AccessMiddleware.accessTokenRequired(
			req,
			{},
			(err = undefined) => {
				if (err) {
					console.log(err)
				}
			}
		)

		expect(req.token.payload.data).to.eql(testTokenPayload.data)
	})

	/**
	 * Testing for a token signed with the wrong key
	 */
	it('Catches token signed with wrong key', () => {
		const testToken = jwt.sign(
			testTokenPayload,
			fakePrivateSignKey, {
			algorithm: "RS256",
			expiresIn: 60 * 10 // active for 10 minutes
		})
		
		req.headers.authorization = `Bearer ${testToken}`

		AccessMiddleware.accessTokenRequired(
			req,
			{},
			(err = undefined) => {
				expect(err.message).to.eql('Token Verification Failed.')
			}
		)
	})

	/**
	 * Catches a non jwt token
	 */
	it('Catches wrong token', () => {
		const testToken = '098f6bcd4621d373cade4e832627b4f6'

		req.headers.authorization = `Bearer ${testToken}`

		AccessMiddleware.accessTokenRequired(
			req,
			{},
			(err = undefined) => {
				expect(err.message).to.eql('Token Verification Failed.')
			}
		)
	})

	/**
	 * Catches valid token send under non Bearer flag
	 */
	it('Catches non Bearer flag', () => {
		const testToken = jwt.sign(
			testTokenPayload,
			privateSignKey, {
			algorithm: "RS256",
			expiresIn: 60 * 10 // active for 10 minutes
		})
		
		req.headers.authorization = `Basic ${testToken}`

		AccessMiddleware.accessTokenRequired(
			req,
			{},
			(err = undefined) => {
				if (err) {
					expect(err.message).to.eql('Bearer Token Required.')
				}
			}
		)
	})
})