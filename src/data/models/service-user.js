'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { BCRYPT, CERTIFICATES } = require('../../config/db/index.json')

const schema = new mongoose.Schema({
	name: {
		type: mongoose.Schema.Types.String,
		required: true
	},
	email: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
		validate: {
      validator(addressToValidate) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressToValidate)
      },
      message: props => `'${props.value}' is not a valid email address.`
    },
	},
	password: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true
	},
	isActive: {
		type: mongoose.Schema.Types.Boolean,
		required: true,
		default: true
	}
}, {
	timestamps: true,
	collection: 'clc_serviceuser'
})


/**
 * Compares a hashed password to a submitted password and runs callback with
 * the results / errors
 * @param { String } password 
 * @param { Function } callback 
 */
schema.methods.comparePassword = function (password, callback) {
	if ( password == null ) return callback( new Error('\'password\' has to be set.') )

	bcrypt.compare(password, this.password, (err, matchingPasswords) => {
		if (err) return callback(err)
		return callback(null, matchingPasswords)
	})
}


/**
 * Creates an access token for the particiular user, using the jsonwebtoken module
 */
schema.methods.createUserAccessToken = function () {
	const privateSignKey = fs.readFileSync(`${ APPLICATION_ROOT }${ CERTIFICATES.PRIVATE }`)

	return jwt.sign({
		data: {
			id: this.id,
			name: this.name
		}
	}, privateSignKey, {
		algorithm: "RS256",
		expiresIn: 60 * 60 * 3 // active for 3 hours
	})
}


/**
 * Runs every time before changes to the user model are saved.
 * The method checks:
 * - if the password was changed: then hashes the new one
 */
schema.pre('save', function (next) {
	if ( !this.isModified('password') ) return next()

	bcrypt.genSalt(BCRYPT.ROUNDS_TO_SALT, (err, salt) => {
		if (err) return next(err)

		bcrypt.hash(this.password, salt, (error, hash) => {
				if (error) return next(error)

				this.password = hash
				return next()
		})
	})
})

module.exports = mongoose.model("Service User", schema)