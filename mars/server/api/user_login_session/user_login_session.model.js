'use strict';

var mongoose = require( 'mongoose');

var UserLoginSessionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	role: {
		type: String
	},
	currentSubscriptions: {
		type: []
	},
	token: {
		type: String
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

var user_login_session = mongoose.model('user_login_session', UserLoginSessionSchema);
module.exports  = user_login_session; 