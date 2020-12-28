'use strict'
var faker = require('faker');
module.exports = function() {

	var userArray = [];

	for(var i=0; i<100; i++){
		var first_name = faker.name.firstName();
		var last_name = faker.name.lastName();
		var random = (Math.floor(Math.random()*1000000000)).toString();
		var front = (Math.floor(Math.random()*3)+7).toString();
		var mobile_number = front+random;
		var date_created = faker.date.past();

		userArray[i] = {
			name : first_name + " "+last_name,
			mobile_number : mobile_number,
			email:faker.internet.email(),
			created_at : date_created,
			updated_at : date_created,
			username: faker.internet.userName(),
			password:'$2b$08$NdkCGsvUWKDLbjwjWHlfN.2EcH3RZZRsOITLP2T4OU2r5Xw5d8hBW',
			role:'user',
			email_verified:true,
		};
		
	}
	return userArray;
}
