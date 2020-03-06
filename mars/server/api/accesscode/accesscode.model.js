'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));


var AccesscodeSchema = new mongoose.Schema({
	accesscode: { type : String , unique : true, required : true, dropDups: true },
	category_type: String,
	original_amount:String,
	user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
	},
	used:Boolean,
	dt_used:{type:Date},
	active:Boolean,
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Accesscode', AccesscodeSchema);