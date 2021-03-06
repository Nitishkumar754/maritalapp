'use strict'
var faker = require('faker');
module.exports = function() {
var User = require('../../api/user/user.model').User;
var profileArray = [];
var Q = require('q');
var moment  =require('moment');

	var d = Q.defer();
	User.find({role:'user'}, function(err, users){
		
		if(!users){
			res.json({"message":"No user found!"})
			return []
		}

		for (var i=0;i<users.length;i++){
			var user = users[i];
				var name = faker.name.firstName()+" "+faker.name.lastName();
			var sex = i%2 == 0 ? 'm' : 'f';
			
			var random = (Math.floor(Math.random()*1000000000)).toString();
			var front = (Math.floor(Math.random()*3)+7).toString();
			var mobile = front+random;
			var date_created = faker.date.past();
			var marital_status = ['never married', 'divorced', 'married']
			var occupation = ['engineer', 'doctor', 'goverment employee', 'jobless', 'private job', 'Homemaker']
			var height = faker.random.number({"min":4,'max':6})+"ft "+faker.random.number({"min":0,'max':11})+"in"
			var dob = faker.date.between('1985-01-01', '2001-01-01')
			var religion = ['hindu','christian', 'muslim', 'jain', 'sikh']
			var blood_group = ['a+', 'b+', 'o+', 'o-', 'ab+', 'ab-', 'a-', 'b-'];
			var diet = ['veg', 'non-veg', 'egg'];
			var current_date = moment()
			var age = current_date.diff(dob, 'years');

			var complexion = ['fair', 'brown', 'wheatish_brown', 'dark'];
			var smoke = ['yes', 'no', 'occasionally']
			var profile_managed_by = ['self', 'parent', 'sibling']
			var body_tyoe = ['slim', 'athletic', 'healthy', 'fat']
			var caste = ['koeri', 'rajput', 'ahir', 'aggarwal', 'arora', 'mali', 'bhumihar', 'brahman','kurmi']
			var education = ['btech', 'ba', 'bsc', 'mtech', 'msc', 'ma', 'phd', 'bcom','mbbs', 'intermidiate', 'Matric', 'Under Matric']
			var interest = ['cooking', 'reading', 'travelling', 'movies', 'dancing', 'singing', 'homemaking', 'music']
			var images =[];
			var district = ['nawada', 'gaya', 'jamui','patna'];
			var state = ['br','mp', 'up']; 
			var profile_application_status = ['incomplete', 'approved', 'submitted', 'rejected'];
			var profile_status = ['pending', 'approved', 'disabled', 'rejected'];
			for (var j=0;j<5;j++){
				images.push('http://lorempixel.com/g/200/300/')
			}
			profileArray[i] = {
				user:user.id,
				name : name,
				gender : sex,
				mobile_number : mobile,
				created_at : date_created,
				updated_at:date_created,
				display_name:faker.name.findName(),
				occupation: occupation[faker.random.number({'min':0, 'max':5})],
				marital_status:marital_status[faker.random.number({'min':0, 'max':2})],
				city:faker.address.city(),
				no_of_brothers:i%3,
				no_of_sisters:i%2,
				country:"india",
				annual_income:faker.random.number({'min': 2,'max': 100}),
				weight:faker.random.number({'min': 45,'max': 120}),
				district:district[faker.random.number({'min':0, 'max':3})],
				profile_image:'http://lorempixel.com/g/200/300/',
				profile_images:images,
				height:height,
				dob:dob,
				state:state[faker.random.number({'min':0, 'max':2})],
				religion:religion[Math.floor(Math.random() * 4) + 0 ],
				blood_group:blood_group[Math.floor(Math.random() * 7) + 0],
				diet:diet[Math.floor(Math.random() * 2) + 0],
				hometown:'Bangalore',
				complexion:complexion[Math.floor(Math.random() * 3) + 0],
				smoke:smoke[Math.floor(Math.random() * 2) + 0],
				drink: smoke[Math.floor(Math.random() * 2) + 0],
				profile_managed_by: profile_managed_by[Math.floor(Math.random() * 2) + 0],
				body_type:body_tyoe[Math.floor(Math.random() * 3) + 0],
				father_occupation:occupation[faker.random.number({'min':0, 'max':5})],
				mother_occupation:occupation[faker.random.number({'min':0, 'max':5})],
				physically_challenged:'No',
				caste:caste[Math.floor(Math.random() * 8) + 0],
				education:education[Math.floor(Math.random() * 11) + 0],
				interest:interest[Math.floor(Math.random() * 7) + 0],
				mother_tounge:'Hindi',
				// profile_application_status:profile_application_status[Math.floor(Math.random() * 4) + 0 ],
				profile_status:profile_status[Math.floor(Math.random() * 4) + 0 ],
				email_verified:true,
				description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"

			};
			
		}
	// console.log("profileArray>>>>>>>>>>>>>>>>>>>>>>>>>> ", profileArray)
	d.resolve(profileArray);
	
	})
return d.promise
}


	
	// for(var i=0; i<2; i++){
	// 	var name = faker.name.firstName()+" "+faker.name.lastName();
	// 	var sex = i%2 == 0 ? 'M' : 'F';
	// 	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> ",i)
	// 	var random = (Math.floor(Math.random()*1000000000)).toString();
	// 	var front = (Math.floor(Math.random()*3)+7).toString();
	// 	var mobile = front+random;
	// 	var date_created = faker.date.past();
		
	// 	profileArray[i] = {
	// 		name : name,
	// 		gender : sex,
	// 		mobile : mobile,
	// 		created_at : date_created,
	// 		updated_at:date_created,
	// 		display_name:faker.name.findName(),
	// 		occupation:"engineer",
	// 		marital_status:"single",
	// 		city:faker.address.city(),
	// 		no_of_brothers:i%3,
	// 		no_of_sisters:i%2,
	// 		country:"India",
	// 		annual_income:faker.random.number({'min': 2,'max': 100}),
	// 		weight:faker.random.number({'min': 45,'max': 120}),
	// 		district:faker.address.city(),
	// 		image_url:faker.image.avatar()

	// 	};
	// 	console.log(profileArray[i])
	// }
	

