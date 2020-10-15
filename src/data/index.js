'use strict'

const mongoose = require('mongoose')
const { CONNECTION_DETAILS } = require('../config/db/index.json')

mongoose.connection.on('error', (err) => {
	console.log(err)
})

mongoose.connection.on('disconnected', () => {
	// we're disconnected
	console.log('Connection to database lost...')
	console.log('Trying to reconnect...')
	setTimeout(connectDB, 3000)
})

mongoose.connection.once('open', () => {
	console.log(`Service successfully connected with Database at 'mongodb:${ CONNECTION_DETAILS.URI }${ CONNECTION_DETAILS.DB }'`)
})

function connectDB() {
	// connect to database cluster (mongodb Atlas)
	mongoose.connect(
		`mongodb:${ CONNECTION_DETAILS.URI }${ CONNECTION_DETAILS.DB }`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
}

module.exports = connectDB