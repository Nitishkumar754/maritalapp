'use strict'
var faker = require('faker');
module.exports = function() {

	var userArray = [];

	for(var i=0; i<50; i++){
		var first_name = faker.name.firstName();
		var last_name = faker.name.lastName();
		var random = (Math.floor(Math.random()*1000000000)).toString();
		var front = (Math.floor(Math.random()*3)+7).toString();
		var mobile = front+random;
		var date_created = faker.date.past();

		userArray[i] = {

			mobile : mobile,
			email:faker.internet.email(),
			created_at : date_created,
			updated_at : date_created,
			username: faker.internet.userName(),
		};
		
	}
	return userArray;
}
