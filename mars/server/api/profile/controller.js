
var Profile = require('./model');
var multer = require('multer');
const AWS = require('aws-sdk');
const secret = require('../../config/environment/secrets');
const moment = require('moment');

var multerS3 = require('multer-s3');
var TinyURL = require('tinyurl');

var mailer = require("../../lib/oauth2_mail.js");
const ejs               = require('ejs');


const Interaction = require('../interaction/interaction.model');

const User = require('../user/user.model').User;

const accessKeyId = secret.aws.accessKeyId
const secretAccessKey = secret.aws.secretAccessKey
const region = secret.aws.region
const apiVersion = secret.aws.apiVersion

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
	console.log("skip>>>>>>>>>>> ",page_number * page_count);
	query.email_verified = true;
	criteria["query"] = query;
	criteria["skip"] = page_number * page_count;
	criteria["limit"] = 10;

	return criteria
}


module.exports.getProfile = async function(req, res){
	console.log("getting profile >>>>>>>>>> ");
	try{

		const profile = await Profile.findOne({user:req.params.id});

	if(!profile){
		res.json({"data":[], "message":"Profile not found"})
	}
	res.json({"data":profile, "message":"success"});
	
	
	//get logged in user profile
	const visitor_profile = await Profile.findOne({user:req.user._id})

	var new_interaction = {
		interaction_type:'visitor',
		user:req.params.id,
		profile:profile._id,
		interacted_user:req.user._id,
		interacted_profile:visitor_profile._id
	};

	const updated_interaction = await Interaction.update({'user':req.params.id, interaction_type:'visitor',interacted_user:req.user._id},new_interaction, {upsert: true} )
	return
	}

	catch(e){
		console.log("errrr",e);
		res.status(500).send({"message":"something went wrong"})
	}
	
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
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
    	console.log("file>>>>>>>>>>>> ",file.originalname);
    	
      cb(null, `${req.user._id}_${Date.now()}_${file.originalname}`)
    }
  })
}).single('file0');

module.exports.image_upload = function(req, res){
	
	upload(req, res, function(err) {
		console.log("req.file...",req.file)
		console.log("re-file>>>>>>>>>>>> ",req.file.location )
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



async function generate_request_query(user, request_body){

	let userProfile = await Profile.findOne({user:user._id}, {gender:1});

	
	query = {}
	var min_dob, max_age;
	if(!request_body){
		return query
	}
	if (request_body.caste){
		query['caste']= request_body.caste.toLowerCase();
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
	
	if(request_body.marital_status && request_body.marital_status.length>0){
		query['marital_status']=[];
		query['marital_status']=request_body.marital_status
	}
	if(request_body.min_age){
		
		var min_dob  =  new moment().subtract(parseInt(request_body.min_age),'years').toDate()
		
	}

	if(request_body.max_age){
		var max_dob  =  new moment().subtract(parseInt(request_body.max_age),'years').toDate()

	}
	if(min_dob && max_dob){
		query['dob'] = {$lte:min_dob, $gte:max_dob}
	}
	else if(min_dob){
		query['dob'] = {$lte:min_dob}
	}
	else if(max_dob){
		query['dob'] = {$gte:max_dob}
	}
	
	if(request_body.gender){
		query['gender']=request_body.gender;
	}
	else{
		let searchGender = userProfile.gender=='m'?'f':'m';
		query['gender'] = searchGender;
	}
	return query;
}

module.exports.regular_search = async (req, res) => {
	console.log("this is search request>>>>>>>>>>> ", req.body);

	let requestBody  = req.body;
	let pageNumber = parseInt(requestBody.pageNumber) || 1;
	let limit = parseInt(requestBody.limit) || 10;
	let skip = (pageNumber-1)*limit;
	var search_query = await generate_request_query(req.user, req.body);
	var query ={"dob":{"$gte":new Date(2000, 7, 15)}}
	console.log("search_query>>>>>>>>>>>> ",search_query);
	try{
		const profiles = await Profile.find(search_query).limit(limit).skip(skip);
		let count = await Profile.countDocuments(search_query);
		console.log("count>>>>>>> ",count);
		if (!profiles){
			res.status(404).json({"message":"something went wrong", profiles:[]})
		}
		res.status(200).json({profiles, "message":"success", count})
	}
	catch(e){
		console.log("e",e);
		res.status(500).send({"message":"Something went wrong", status:500, error:e.message});
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


module.exports.who_viewed_my_profile = async (req, res) => {

	console.log("req.user._id>>>>>>>>>> ",req.user._id);
	try{
		const visitor_profile = await Interaction.find({user:req.user._id.toString(), interaction_type:'visitor'})
		.populate({path:'interacted_profile', select:'display_name profile_image last_active district state cast religion height higher_education dob occupation'})
		.limit(10)
		.sort('dt_updated');
		console.log("visitor_profile>>>>>>>>>>>> ",visitor_profile);
		if (!visitor_profile){
			res.status(200).json({"message":"No visitor found", visitor_profile:[]})
		}
		res.status(200).json({visitor_profile, "message":"success"})
	}
	catch(e){
		 console.log("errr>>>>>>>>>>>>> ",e);
		res.status(500).send({"message":"something went wrong",visitor_profile:[]})
	}

}



module.exports.get_my_interest = async (req, res) => {

	console.log("req.user._id>>>>>>>>>> ",req.user._id);
	try{
		const profile_list = await Interaction.find({user:req.user._id.toString(), interaction_type:'interest'})
		.populate({path:'interacted_profile', select:'display_name profile_image last_active district state cast religion height higher_education dob occupation'})
		.limit(10)
		.sort('dt_updated');
		console.log("my_interest>>>>>>>>>>>> ",profile_list);
		if (!profile_list){
			res.status(200).json({"message":"No Interest Sent", profile_list:[]})
		}
		res.status(200).json({profile_list, "message":"success"})
	}
	catch(e){
		 console.log("errr>>>>>>>>>>>>> ",e);
		res.status(500).send({"message":"something went wrong",profile_list:[]})
	}

}

// module.exports.get_interested_in_me = async (req, res) => {

// 	console.log("req.user._id>>>>>>>>>> ",req.user._id);
// 	try{
// 		const profile_list = await Interaction.find({interacted_user:req.user._id.toString(), interaction_type:'interest'})
// 		.populate({path:'interacted_profile', select:'display_name profile_image last_active district state cast religion height higher_education dob occupation'})
// 		.limit(10)
// 		.sort('dt_updated');
// 		console.log("interested_in_me>>>>>>>>>>>> ",profile_list);
// 		if (!profile_list){
// 			res.status(200).json({"message":"No visitor found", profile_list:[]})
// 		}
// 		res.status(200).json({profile_list, "message":"success"})
// 	}
// 	catch(e){
// 		 console.log("errr>>>>>>>>>>>>> ",e);
// 		res.status(500).send({"message":"something went wrong",profile_list:[]})
// 	}

// }


module.exports.get_interested_in_me = async (req, res) => {

	console.log("req.user._id>>>>>>>>>> ",req.user._id);
	try{
		const profile_list = await Interaction.aggregate([
			{$match:{interacted_user:req.user._id, interaction_type:'interest'}},
			{$lookup:{from : 'profiles',localField:'user',foreignField:'user', as:'profile' }},
			{$project:{'profile.display_name':1,'profile.profile_image':1,
			'profile.dob':1,'profile.height':1,'last_active':1,'profile.higher_education':1, 
			'profile.caste':1,'profile.occupation':1}},
			{$unwind:"$profile"}
			])
		// .populate({path:'interacted_profile', select:'display_name profile_image last_active district state cast religion height higher_education dob occupation'})
		// .limit(10)
		// .sort('dt_updated');
		console.log("interested_in_me>>>>>>>>>>>> ",profile_list);
		if (!profile_list){
			res.status(200).json({"message":"No visitor found", profile_list:[]})
		}
		res.status(200).json({profile_list, "message":"success"})
	}
	catch(e){
		 console.log("errr>>>>>>>>>>>>> ",e);
		res.status(500).send({"message":"something went wrong",profile_list:[]})
	}

}

module.exports.get_my_shorlisted = async (req, res) => {

	console.log("req.user._id>>>>>>>>>> ",req.user._id);
	try{
		const profile_list = await Interaction.find({user:req.user._id.toString(), interaction_type:'favourite'})
		.populate({path:'interacted_profile', select:'display_name profile_image last_active district state cast religion height higher_education dob occupation'})
		.limit(10)
		.sort('dt_updated');
		console.log("shortlisted>>>>>>>>>>>> ",profile_list);
		if (!profile_list){
			res.status(200).json({"message":"No visitor found", profile_list:[]})
		}
		res.status(200).json({profile_list, "message":"success"})
	}
	catch(e){
		 console.log("errr>>>>>>>>>>>>> ",e);
		res.status(500).send({"message":"something went wrong",profile_list:[]})
	}

}


module.exports.contact_viewed_by_me = async (req, res) => {

	console.log("req.user._id>>>>>>>>>> ",req.user._id);
	try{
		const viewed_contacts = await Interaction.find({user:req.user._id.toString(), interaction_type:'contacted'})
		.populate({path:'interacted_profile', select:'display_name profile_image last_active district state cast city district addressline religion height higher_education dob occupation'})
		.populate({path:'user',select:'name mobile_number email'})
		.limit(10)
		.sort('dt_updated');
		console.log("viewed_contacts>>>>>>>>>>>> ",viewed_contacts);
		if (!viewed_contacts){
			res.status(200).json({"message":"No visitor found", viewed_contacts:[]})
		}
		res.status(200).json({viewed_contacts, "message":"success"})
	}
	catch(e){
		 console.log("errr>>>>>>>>>>>>> ",e);
		res.status(500).send({"message":"something went wrong",viewed_contacts:[]})
	}

}



module.exports.send_interest = async function(req, res){
	console.log("req.params_id>>>>>>>>> ",req.params.id);
	try{

		const to_send_profile = await Profile.findOne({_id:req.params.id});

	if(!to_send_profile){
		res.json({"data":[], "message":"Profile not exists"})
	}
	
	const sender_profile = await Profile.findOne({user:req.user._id})
	console.log("sender_profile>>>> ",sender_profile);


	var new_interaction = new Interaction({
		interaction_type:'interest',
		user:req.user._id,
		profile:sender_profile._id,
		interacted_user:to_send_profile.user,
		interacted_profile:to_send_profile._id
	});

	const sent_interaction = await Interaction.findOne({'user':req.user._id, interaction_type:'interest',interacted_user:to_send_profile.user})
	if(sent_interaction){
		res.status(403).send({"message":"Already interest sent "});
		return
	}


	const [new_inter, to_send_user] = await Promise.all([new_interaction.save(), User.findOne({_id:to_send_profile.user})]);
	var mail_obj = {
		to_send_name:to_send_profile.display_name,
		display_name:sender_profile.display_name,
		height:sender_profile.height || "",
		education:sender_profile.education || '',
		caste:sender_profile.caste|| '',
		religion: sender_profile.religion || '',
		occupation:sender_profile.occupation || '',
		income:sender_profile.income || '',
		profile_url : `http://shaadikarlo.in/member_profile/${sender_profile._id}`
		
	}
	console.log("to_send_user>>> ",to_send_user);
	let to_send_email = to_send_user.email;
	await send_interest_mail(mail_obj, to_send_email);

	res.status(200).send({"message":"Interest sent"});

	}

	catch(e){
		console.log("errrr",e);
		res.status(500).send({"message":"something went wrong"})
	}
	
}



module.exports.short_list = async function(req, res){
	
	try{

		const to_send_profile = await Profile.findOne({_id:req.params.id});
		console.log("to_send_profile>>>>>>>> ",req.params.id, to_send_profile);

	if(!to_send_profile){
		res.json({"data":[], "message":"Profile not exists"})
	}
	
	const sender_profile = await Profile.findOne({user:req.user._id})

	var new_interaction = new Interaction({
		interaction_type:'favourite',
		user:req.user._id,
		profile:to_send_profile._id,
		interacted_user:to_send_profile.user,
		interacted_profile:to_send_profile._id
	});

	const sent_interaction = await Interaction.findOne({'user':req.user._id, interaction_type:'favourite',interacted_user:to_send_profile.user})
	if(sent_interaction){
		res.status(403).send({"message":"Already shortlisted"});
		return
	}
	const new_inter = await new_interaction.save();
	res.status(200).send({"message":"Success"});

	}

	catch(e){
		console.log("errrr",e);
		res.status(500).send({"message":"something went wrong"})
	}
	
}



module.exports.get_guest_requested_profile = async (req, res) => {
	
	// var query = generate_query(req.body);

	try{
		const profiles = await Profile.find({}).limit(5)
		
	
		if (!profiles){
			res.status(200).json({"message":"No contacts viewed", profiles:[]})
		}
		res.status(200).json({profiles, "message":"success"})
	}
	catch(e){
		res.status(500).send({"message":"something went wrong",profiles:[]})
	}
	

}




module.exports.getProfileSharableLink = async (req, res) =>{

	let profile_id = req.params.id;

	if(!profile_id){
		res.status(400).send({"message":"Missing profile id in request", status:400});
		return;

	}

	let link = await Profile.findOne({_id:profile_id}, {shared_link:1});

	if(link && link.shared_link){
		console.log("shared_link>>>", link.shared_link);

		res.status(200).send({"message":"success", status:200, shared_link:link.shared_link});
		return;

	}
	let url = `${req.get('origin')}/shared/profile/${profile_id}`;
	TinyURL.shorten(url, async function(link, err) {
		
		let saved = await Profile.updateOne({_id:profile_id}, {$set:{shared_link:link}});
		
	  if (!err)
	    res.status(200).send({"message":"success", status:200, shared_link:link});
	});

	

}



module.exports.getSharedProfileAPI = async(req, res)=>{

	let profile_id = req.params.id;

	if(!profile_id){
		res.status(400).send({"message":"Profile id is missing in request", status:400});
		return;
	}

	const profile = await Profile.findOne({_id:req.params.id});

	if(!profile.shared_link){
		res.status(400).send({"message":"This link has been expired. Please login to view this profile", status:400})
		return;
	}
	if(!profile){
		res.json({"data":[], "message":"Profile not found"})
	}
	res.json({"data":profile, "message":"success"});
}


module.exports.list_user_profile_photo = async(req, res)=>{


	let profile_id = req.params.id;


	let photos = await Profile.findOne({user:req.user._id}, {profile_images:1});

	console.log("photos>>>>>>>>>> ",photos);
	res.status(200).send({"message":"success",photos: photos.profile_images});

}


module.exports.delete_user_profile_photo = async(req, res)=>{

	let url = req.body.url;
	console.log("deleteing url>>>> ",url);
	try{
		let updated = await Profile.updateOne({user:req.user._id}, { $pullAll: {profile_images: [url] } });
		console.log("updated>>>>>> ",updated);
		res.status(200).send({"message":"success", status:200});

	}
	catch(e){
		res.status(500).send({"message":"Something went wrong!", status:500, error:e.message});
		return;
	}
	
}


async function send_interest_mail(mail_obj, to_email){
	console.log("mail_obj>>>> ", mail_obj, "to_email>> ",to_email);

	let to  = to_email;
	let subject= `${mail_obj.display_name} has expressed interest in your profile`;
	
	let text = '';
	
	ejs.renderFile(__dirname+'/../../email_templates/interest_received.ejs', {data:mail_obj}, async (err, data) => {
		
		if (err) {
			  throw err;
		} else {

			console.log("html **** ",data);

			let html = data;

			await mailer.triggerMail(to,subject, text, html)

		}

	
});
}
