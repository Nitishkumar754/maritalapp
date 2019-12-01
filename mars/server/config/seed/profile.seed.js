'use strict'
var faker = require('faker');
module.exports = function() {
var User = require('../../api/user/user.model').User;
var profileArray = [];
var Q = require('q');
var moment  =require('moment');

	var d = Q.defer();
	User.find({}, function(err, users){
		
		if(!users){
			res.json({"message":"No user found!"})
			return []
		}

		for (var i=0;i<users.length;i++){
			var user = users[i];
				var name = faker.name.firstName()+" "+faker.name.lastName();
			var sex = i%2 == 0 ? 'M' : 'F';
			
			var random = (Math.floor(Math.random()*1000000000)).toString();
			var front = (Math.floor(Math.random()*3)+7).toString();
			var mobile = front+random;
			var date_created = faker.date.past();
			var relationship = ['single', 'married', 'widowed']
			var occupation = ['engineer', 'doctor', 'goverment employee', 'jobless', 'private job', 'Homemaker']
			var height = faker.random.number({"min":4,'max':6})+"ft "+faker.random.number({"min":0,'max':11})+"in"
			var dob = faker.date.between('1985-01-01', '2001-01-01')
			var religion = ['Hindu','Christian', 'Muslim', 'Jain', 'Sikh']
			var blood_group = ['A+', 'B+', 'O+', 'O-', 'AB+', 'AB-', 'A-', 'B-'];
			var diet = ['Veg', 'Non-Veg', 'Eggatarian'];
			var current_date = moment()
			var age = current_date.diff(dob, 'years');

			var complexion = ['Fair', 'Brown', 'wheatish Brown', 'dark'];
			var smoke = ['yes', 'no', 'occasionally']
			var profile_managed_by = ['self', 'parent', 'sibling']
			var body_tyoe = ['slim', 'athletic', 'healthy', 'fat']
			var cast = ['Dangi', 'Rajput', 'ahir', 'aggarwal', 'arora', 'mali', 'bhumihar', 'brahman']
			var education = ['BTech', 'BA', 'BSc', 'Mtech', 'Msc', 'MA', 'PHD', 'Bcom','MBBS', 'Intermidiated', 'Matric', 'Under Matric']
			var interest = ['cooking', 'reading', 'travelling', 'movies', 'dancing', 'singing', 'homemaking', 'music']
			var images =[]; 
			var profile_status = ['incomplete', 'approved', 'submitted', 'rejected'];
			for (var j=0;j<5;j++){
				images.push(faker.image.avatar())
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
				marital_status:relationship[faker.random.number({'min':0, 'max':2})],
				city:faker.address.city(),
				no_of_brothers:i%3,
				no_of_sisters:i%2,
				country:"India",
				annual_income:faker.random.number({'min': 2,'max': 100}),
				weight:faker.random.number({'min': 45,'max': 120}),
				district:faker.address.city(),
				profile_image:faker.image.avatar(),
				profile_images:images,
				height:height,
				dob:dob,
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
				cast:cast[Math.floor(Math.random() * 7) + 0],
				education:education[Math.floor(Math.random() * 11) + 0],
				interest:interest[Math.floor(Math.random() * 7) + 0],
				mother_tongue:'Hindi',
				profile_status:profile_status[Math.floor(Math.random() * 4) + 0 ]

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
	

