
var Profile = require('./model');
var multer = require('multer');
const AWS = require('aws-sdk');
const secret = require('../../config/environment/secrets');
const moment = require('moment');

var multerS3 = require('multer-s3')


const accessKeyId = secret.aws.accessKeyId
const secretAccessKey = secret.aws.secretAccessKey
const region = secret.aws.region
const apiVersion = secret.aws.apiVersion
console.log("region>>>>>>>>>>>>>.",region);
const S3 = new AWS.S3({
	        apiVersion: apiVersion, 
	        region: region,
	        credentials:{"accessKeyId": accessKeyId,
        			"secretAccessKey": secretAccessKey
        			} 
        	});


function get_profiles_count(criteria){
	return Profile.count(criteria.query);
}

function get_profiles(criteria){

	console.log("criteria>>>>>>>> ",criteria);
	return Profile.find(criteria.query)
		.skip(criteria.skip)
		.limit(criteria.limit)
		.sort('-created_at');
}


function get_user_profile(id, req_body){
	return Profile.findOne({user:id});
}


function  generate_query(user_profile, req_body, history_search=null){
	var criteria = {"query":{}, "limit":10, "skip":0}

	var query = {}
	const page_number = req_body['pageNumber'] || 0;
	const page_count = req_body['pageCount'] || 10;

	if (user_profile.gender && user_profile.gender=='m'){
		query.gender = 'f'
	}
	else{
		query.gender = 'm'
	}
	query.email_verified = true;
	criteria["query"] = query;
	criteria["skip"] = page_number * page_count;
	criteria["limit"] = 10;

	return criteria
}


module.exports.getProfile = function(req, res){
	
	Profile.findOne({user:req.params.id}).then(function(profile){
		if(!profile){
			res.json({"data":[], "message":"Profile not available"})
			return
		}
		console.log("getting_profile>>>>>>>>>>>> ");
		res.json({"data":profile})
	})
}

module.exports.getAll = async function(req, res){
	console.log("req body>>>>>>>>>>>> ",req.body);
	try {
		const user_profile = await get_user_profile(req.user._id.toString());
		
		const criteria = generate_query(user_profile, req.body)
		const count = await get_profiles_count(criteria);
		const profiles = await get_profiles(criteria)
		if(!profiles){
			res.status(200).json({"data":[], "message":"No record found"})
		}
		res.status(200).json({"data":profiles, "message":"success", count})
	}
	catch(e){
		console.log("e>>>>>>>>> ",e);
		res.status(500).json({message:"something went wrong", data:[]})
	}
	
}




// var Storage = multer.diskStorage({
//      destination: function(req, file, callback) {
//      	console.log("file>>>>>>>>>>>>>>>>>>>>>>> ", file)
//          callback(null, "./uploads/images");
//      },
//      filename: function(req, file, callback) {
//      	var file_name = file.fieldname + "_" + Date.now() + "_" + file.originalname;
//      	console.log("file_name>>>>>>>>>>>>>> ", file_name);
//          // callback(file_name, file_name);
//          callback(null, file_name);
//      }
//  });


// var upload = multer({
//      storage: Storage
//  }).single('file0'); //Field name and max count



var upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: 'shaadikarlo/userImages',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
    	console.log("file>>>>>>>>>>>> ",file.originalname);
    	
      cb(null, `${req.user._id}_${moment().format()}`)
    }
  })
}).single('file0');

module.exports.image_upload = function(req, res){
	
	upload(req, res, function(err) {

		console.log("re-file>>>>>>>>>>>> ",req.file.lo )
         Profile.updateOne({user:req.user.id}, {$push: {profile_images: req.file.location}, profile_image:req.file.location })
		.then(function(data){
			res.status(200).json({"status":true, "message":"success"})
		
		})
});
	
}


module.exports.update_user_profile = async (req, res) => {
	console.log("req.body>>>>>>>>>>> ",req.body);
	var to_update = {}
	var attribute = Object.keys(req.body);
	// console.log("attribute>>>>>>>>> ",attribute);
	try{
		var profile = new Profile(to_update);
	
	var profile = await Profile.findone_or_create({ user: req.user._id });
	var partner = {}
	attribute.forEach((key)=>{

		if(req.body[key]){
			profile[key]=req.body[key];
			if(key.includes('partner')){
				partner[key.substring('partner'.length+1)] = req.body[key];
			}
		}
		// console.log("key>>>>>>>>>>>>> ",key, req.body[key], profile[key]);
	})
	profile.partner = partner;
	var saved_profile = await profile.save();
	console.log("saved_profile>>>>>>>>>>>> ",saved_profile);

	res.status(200).send({message:"Updated successfully"});

	}

	catch(e){
		console.log("error>>>>>>>>>> ",e);
		res.status(500).send({message:"Something went wrong"});
	}
	
	
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