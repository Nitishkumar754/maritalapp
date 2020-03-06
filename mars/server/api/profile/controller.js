
var Profile = require('./model');
var multer = require('multer');


function get_profiles(query){
	return Profile.find(query)
	.limit(20)
}

function get_user_profile(id){
	return Profile.findOne({user:id})
}

function generate_member_query(user_profile, history_search=null){
	var query = {}
	if (user_profile.gender && user_profile.gender=='m'){
		query.gender = 'f'
	}
	else{
		query.gender = 'm'
	}
	
	return query
}


module.exports.getAll = async function(req, res){
	console.log("get_all >>>>>>>>>>>>>>>>> ",req.user);

	try {
		const user_profile = await get_user_profile(req.user._id.toString());
		console.log("user_profile>>>>>>> ", user_profile);
		const query = generate_member_query(user_profile)
		console.log("query>>>>>>>>>> ", query);
		const profiles = await get_profiles(query);
		if(!profiles){
			res.status(200).json({"data":[], "message":"No record found"})
		}
		res.status(200).json({"data":profiles, "message":"success"})
	}
	catch(e){
		console.log("e>>>>>>>>> ",e);
		res.status(500).json({message:"something went wrong", data:[]})
	}
	
}
//ObjectId("5ccddd6246a4012e219073b2")
module.exports.getProfile = function(req, res){
	console.log("getProfile >>>>>>>>>>>>>>>>> ",req.user);
	
	Profile.findOne({user:req.params.id}).then(function(profile){
		console.log("profile>?????????????????? ", profile)
		if(!profile){
			res.json({"data":[], "message":"Profile not available"})
			return
		}
		res.json({"data":profile})
	})
}


var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
     	console.log("file>>>>>>>>>>>>>>>>>>>>>>> ", file)
         callback(null, "./uploads/images");
     },
     filename: function(req, file, callback) {
     	var file_name = file.fieldname + "_" + Date.now() + "_" + file.originalname;
     	console.log("file_name>>>>>>>>>>>>>> ", file_name);
         // callback(file_name, file_name);
         callback(null, file_name);
     }
 });


var upload = multer({
     storage: Storage
 }).single('file0'); //Field name and max count



module.exports.image_upload = function(req, res){
	
	console.log("req.user>>>>>>>>>>>>>> ", req.user, ">>>>>>>>>>>>>>>>>>>>>");
	upload(req, res, function(err) {
		console.log('err>>>>>>>>>> ', err);

		console.log("req.file>>>>>>>>>> ", req.file);
		// console.log("re-file-name>>>>>>>>>>>> ", )
         Profile.updateOne({user:req.user.id}, {$push: {profile_images: req.file.filename} })
		.then(function(data){
			console.log("data>>>>>>>>>>>>>>>>> ",data);
			res.status(200).json({"status":true, "message":"success"})
		
		})
});
	
}


module.exports.update_user_profile = (req, res) => {
	
	Profile.findone_or_create({ user: req.user._id })
	.then(function(profile_data){
		console.log("profile_data>>>>>>>>>>>>>>>>>>>>",profile_data);
	}).catch(function(err){

	})
	
}



function generate_request_query(request_body){
	query = {marital_status:['never_married','divorced','widowed']}
	if(!request_body){
		return query
	}
	if (request_body.cast){
		query['cast']=request_body.cast.toLowerCase();
	}
	if (request_body.district){
		query['district']=request_body.district.toLowerCase();
	}
	if(request_body.state){
		query['state']=request_body.state.toLowerCase();
	}

	if(request_body.religion){
		query['religion']=request_body.religion.toLowerCase();
	}
	if(request_body.never_married){
		query.marital_status.push('never_married');
	}
	if(request_body.divorced){
		query.marital_status.push('divorced');
	}
	if(request_body.widowed){
		query.marital_status.push('widowed');
	}
	
	return query;
}

module.exports.regular_search = async (req, res) => {
	console.log("this is search request>>>>>>>>>>> ", req.body);

	var search_query = generate_request_query(req.body);
	console.log("search_query>>>>>>>>>>>> ",query);
	try{
		const profiles = await Profile.find(query).limit(10);

		if (!profiles){
			res.status(404).json({"message":"something went wrong", profiles:[]})
		}
		res.status(200).json({profiles, "message":"success"})
	}
	catch(e){
		res.status(500).send(e)
	}
	

}


module.exports.get_viewed_contacts = async (req, res) => {
	
	console.log("req.user._id>>>>>>>>>> ",req.user._id);
	try{
		const profile = await Profile.findOne({user:req.user._id.toString()})
		.populate({path:'viewed_contacts', populate :{path:'user', select: 'email mobile name'}})
		const viewed_contacts = profile.viewed_contacts;
		if (!viewed_contacts){
			res.status(200).json({"message":"No contacts viewed", viewed_contacts:[]})
		}
		res.status(200).json({viewed_contacts, "message":"success"})
	}
	catch(e){
		res.status(500).send({"message":"something went wrong",viewed_contacts:[]})
	}
	

}

// module.exports.most_dist = async(req, res) => {
// 	try{
// 		const moment = require('moment');
// 	    dateTo = moment().format('YYYY-MM-DD');
// 	    dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
// 		const profiles = await Profile.aggregate(
// 		// { $group: { _id: null, myCount: { $sum: 1 } } },

// 		[ 
// 		{$match:{dt_created:{$gte:dateFrom}}},
// 		{ $group: {_id:{district:"$district"}, 
// 					mycount:{$sum:1}, state:{"$first":"$state"}
					
//                     }
//                      },

//           { $match : { mycount : {$gte:5} } }, 

//         ]
	

// 	)

// 	res.status(200).json({profiles:profiles})
// 	}
// 	catch(e){

// 		console.log("e>>>>>>>>>>> ",e);
// 		res.status(500).json({profiles:[]})
// 	}


// }