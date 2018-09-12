const mainConfig = require('./main.js');

module.exports = {
	'googleAuth': {
		'clientID': '911992056725-uno0u77p6vc770gnv30jmr9t7bl6hhk8.apps.googleusercontent.com',
		'clientSecret': 'IQFbeMCs4fAmm2iJNzT4hDt1',
		'callbackURL': `${mainConfig.hostFull}/auth/google/callback`
	}
}