const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'mypass';
const someOtherPlaintextPassword = 'not_bacon';

var q = require('q');

module.exports = {

	password_hash:function(){
		return new Promise(function(resolve, reject){

		return bcrypt.genSalt(saltRounds, function(err, salt) {
	    return bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
	        resolve(hash);
		    });
		});

		})
		
	}

}
