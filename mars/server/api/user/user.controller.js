var User = require('./user.model').User;
var Profile = require('../profile/model');
var User_OTP = require('./user.model').User_OTP;
var mongoose = require('mongoose');
var subscription_utils = require('../subscription_order/subscription_order.utils');

const Subscription_order = require('../subscription_order/subscription_order.model');
var user_util = require('./user.utils');
var bcrypt_util = require('./bcrypt_utils');

const Interaction = require('../interaction/interaction.model');

var mailer = require("../../lib/mail.js");

var oauth_mailer = require('../../lib/oauth2_mail');

const jwt  = require('jsonwebtoken');

var config = require('../../config/environment');

const EMAIL_SECRET = 'email-verifications-secret'

module.exports.getOwnProfile = async function (req, res) {
   
  var id = mongoose.Types.ObjectId(req.user._id);
  const profile = await Profile.findOne({user:id}).populate({path:'user', select:'email mobile_number name'})
  res.json({"data":profile, message:"Success"})	
}


module.exports.getAll = function(req, res){
	User.find({}, function(err, data){
		console.log("err>>>>>>>>>>>>>>> ",err)
		if(!data){
			res.json({"message":"No user found!"})
			return
		}
		res.json({"data":data, "message":"Success"})
	})
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


async function create_profile(user_id,req_body){
  var gender = req_body['gender'];
  var dob = req_body['dob'];
  var g='';
  var profile_image = '';
  if(gender=='male'){
      g = 'm';
      profile_image = '../../assets/images/male.jpeg';

  }
  if (gender=='female'){
      g = 'f';
      profile_image = '../../assets/images/female.png';
  }
return Profile.findone_or_create({
  user:user_id,
  display_name:makeid(6),
  dob:dob,
  gender:g,
  profile_image:profile_image,
  state:req_body['state'].toLowerCase(),
  district:req_body['district'].toLowerCase(),
  addressline:req_body['addressline'].toLowerCase()
  
})
}

function get_email_verification_url(id){
  const email_token = jwt.sign({_id:id.toString()}, EMAIL_SECRET, {expiresIn: '3d'});
    
  const email_verification_url = `http://${config.prod_url}:${config.port}/api/user/email/confirmation/${email_token}`;
  return email_verification_url
}


module.exports.register_new_user = async function(req, res) {
	console.log("req.body.user>>>>>>>>>>>>>>>>>> ",req.body.user);
  if (req.body.user) {
    var request_data = req.body.user;
    validate_arr = user_util.validate_request_body(req.body.user)
    
    if (!validate_arr[0]){
      res.status(400).send({"error":validate_arr[1]}); 
      return;
    }
    user_register_body = Object.keys(req.body.user);
    var userDetails = {};

    try{

      const user = await User.find({
        email: request_data.email
      })
      console.log("user>>>>>>>>>>>>> ",user);
      if(user.length > 0 && !user.email_verified){
        res.status(403).send({status:false,"error":"Email already in use. Email verification pending.Please click on verify email link",email_verification:false}); 
        return;
      }
      if (user.length){
         res.status(403).send({status:false,"error":"This email is already registered!"}); 
         return
      }

      var new_user = new User ();
      user_register_body.forEach((key) => new_user[key] = req.body.user[key]);

      const user_data = await new_user.save();

      console.log("user_data>>>>>>>>>>>> ", user_data);
      const profile_data = await create_profile(user_data._id, req.body.user)
      console.log("profile_data>>>>>>>>>>>> ",profile_data);

      userDetails["email"] = user_data.email;
      userDetails["name"] = user_data.name;
      userDetails["id"] = user_data._id;
      
      user_util.send_email_verification_url(userDetails);
      
      res.status(200).send({
        "status":true, message:`A verification link has been sent to your email. Please click on link to verify your email`})
      
    }
    catch(e){
      console.log("err>>>>>>>>>>>> ",e);
      res.status(500).send({error:"something went wrong !"})
    }
   }
}


module.exports.verify_otp = function(req,res){
	console.log("req.body>>>>>>>>>> ",req.body);
	if(!req.body || !req.body.user_id){
		return res.status(400).send({status:false, "error":"User id missing in request"})
	}
	if(!req.body.otp){
		return res.status(400).send({status:false, "error":"Otp missing in request"})
	};
	
	var id = mongoose.Types.ObjectId(req.body.user_id);
	
	User_OTP.findOne({
        user: id,
        active:true,
        otp:req.body.otp
        
      })
      .then(function(user) {
      	
      	if (!user){
      		return res.status(400).send({status:false, "error":"User not found"})
      	}
      	if (user.email_verified){
      		return res.status(400).send({status:false, "error":"Email already verified"})
      	}
      	User.findOneAndUpdate({_id:id}, { email_verified: true })
      	.then(function(data){
      		res.status(200).send({status:true, "message":"Verification successful"})
      	})
      	.catch(function(err){
      		res.status(500).send({status:false, "error":"Server side error"})
      	})

      })
      .catch(function(err){
      	return res.status(500).send({status:false, "error":"Server side error"})
      })
      	
}


function createGetAllQuery(query) {
  console.log("query>>>>>>>>>>>>>>>>>>>>1 ",query);
  var options = {};
  options.criteria = {};
  var pageNumber = query.pageNumber - 1;
  var pageCount = query.pageCount;
  options.pageCount = pageCount;
  options.pageNumber = pageNumber;
  if (query.search) {
     console.log("query>>>>>>>>>>>>>>>>>>>>2 ",query.search);
    var search = new RegExp(query.search, "i");
    // console.log("search>>>>>>>>>>>>>>>>>>>>3 ",JSON.stringify(search));
    options.criteria = {
      $or: [{
        'first_name': search
      }, {
        'last_name': search
      }, {
        'email': search
      }, {
        'mobile_number': search
      },{
        'mode':search
      }]
    };
  }

  if (query && query.name) {
    var terms = query.name.split(' ');
    var regexString = "";

    for (var i = 0; i < terms.length; i++) {
      regexString += terms[i];
      if (i < terms.length - 1) regexString += '|';
    }
    var re = new RegExp("^" + regexString, 'ig');
    options.criteria = {
      $or: [{
        "first_name": {
          $regex: re
        }
      }, {
        "last_name": {
          $regex: re
        }
      }]
    };
  }

  if (query.email) {
    console.log("email>>>>>>>>>>>>>>>>>>>>&&&&&&&&& ",query.email);
    // options.criteria.email = {
    //   $regex: new RegExp('^' + query.email, 'i')
    // };
    options.criteria.email = query.email

  }

  if (query.mobile_number) {
    options.criteria.mobile_number = query.mobile_number;
  }
  if (query.role) {
    options.criteria.role = {
      $regex: new RegExp('^' + query.role, 'i')
    };
  }

  // if (query.is_active) {
  //   options.criteria.is_active = query.is_active == 'active' ? true : false;
  // }
  

  // if (query.fields) {
  //   options.fields = query.fields.split(',').join(' ');
  // }

  options.sort = {};
  if (query.sortBy) {
    options.sort[query.sortBy] = query.direction;
  } else {
    options.sort.created_at = -1
  }

  console.log("options>>>>>>>>>>>>>>>>>4 ",JSON.stringify(options));

  return options;
}


module.exports.index  = function(req, res) {
  console.log("body>>>>>>>>>>>>>> ", req.body);
  var options = {};
  var users = {};
  if (req.body.query) {
    options = createGetAllQuery(req.body.query);
  }
  var skip = 0;
  var pageNumber = options.pageNumber;
  if (options.pageNumber) {
    pageNumber = pageNumber > 0 ? pageNumber : constants.DEFAULT_PAGE_NUMBER;
    skip = pageNumber * options.pageCount;
  }
  
    var searchQuery = {
          $lookup:
             {
                from: "profiles",
                localField: "_id",
                foreignField: "user",
                as: "profile"
            }
        }

    var match = {
          $match:options.criteria
        }
    var project = {
          // $project: { first_name: 1,last_name:1, email:1,mobile_number:1, role:1,is_active:1,'userSubs.subscription.category':1,'userSubs.subscription.mode':1,'userSubs.status':1 } 
        }
    var skip = {
          $skip : parseInt(skip)
        }
    var count = {
          $count: 'count'
        }

    // Parses string to integer for sort by eg. {firstname:'-1'} => {first_name:1}
    console.log("options>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",options);
    var keys = Object.keys(options.sort);
    options.sort[keys[0]]=parseInt(options.sort[keys[0]]);
    var sort = {
      $sort:options.sort
    }
   
  User.aggregate([searchQuery, skip, match])
    .limit(options.pageCount)
  .then(function(data){
      // console.log("data1>>>>>>>>>>>>>>>>>>>>>>>", data);
      users.user = data;
      User.aggregate([searchQuery,match, count])
      .limit(options.pageCount) 
      .then(function(data){
        // console.log("data2>>>>>>>>>>>>>>>>>>>>>>>", data);
       if(data && data[0] && data[0].count){
         users.count=data[0].count;
       }
       
        res.status(200).json(users);
      })
      .catch(function(err){
        console.log("err>>>>>> ",err);
        res.send(500, error);
      })
  })
  .catch(function(err){
      console.log("err",err);
       res.send(500, error);
  })

}



module.exports.admin_create_user_account = function(req, res){
  
  var data = req.body;

  var encrypted_password = bcrypt_util.password_hash(data.password);
  encrypted_password.then(function(hashed_password){
   
    var user = new User({
            name: data.name,
            email: data.email,
            mobile: data.mobile_number,
            password:hashed_password,
            role: 'user',
            is_active: true,
            created_by:'admin'
          });

     user.save()
    .then(function(user) {
      console.log("data>>>>>>>>>>>>>> ",data);

      var address = [{'addressline1':data.address1, 'addressline2':data.address2, 'city':data.city, 'state':data.state, 'pincode':data.pincode}]
      
      console.log("address>>>>>>>>>>> ",address);
      var profile = new Profile({
        // address:address,
        state:data.state,
        district:data.district,
        addressline:data.addressline,
        user_id:user._id
      })

      profile.save()
      .then(function(data){

        res.status(200).send({message:"success"})

      })
      
    });

  })
  
}


module.exports.get_user_profile_detail = function(req, res){

/* This api is used to get user and profile data of user*/

 
  var id = mongoose.Types.ObjectId(req.params.id);

  Profile.findOne({user:id})
  .populate({path:'user', select:'name mobile_number email name address', rename:'User'})
  .exec(function (err, profiledata) {
    console.log("profiledata>>>>>>>>>>>>>> ",profiledata);
    if (err) {
      res.state(400).json({"error":"Something went wrong"})
      return;
    }
    res.json({"data":profiledata, "message":"Success"})
    
  });
}



module.exports.admin_update_user_profile = function(req, res){
/* This admin api is used to update user and profile data of user*/


  user_update_body = user_util.get_user_update_body(req.body);
  
  User.update({_id:req.body.user._id}, user_update_body)
  .then(function(user_update){
    return user_update;
  })
  .then(function(user_update){
    profile_update_body = user_util.get_profile_update_body(req.body);
    console.log("profile_update_body>>>>>>>>>>>>> ", profile_update_body);
    Profile.updateOne({user:req.body.user._id}, profile_update_body)
    .then(function(profile_update){

      res.status(200).json({"message":"profile updated"})
    })
  })
  .catch(function(err){
    console.log("err>>>>>>>>>>>> ",err);
    res.status(500).json({"error": "something went wrong"})
  })

}


// module.exports.get_data_for_subscribed_user = async (req, res) => {
//   console.log("params>>>>>>>>>>>>>>> ",req.params);
//   // console.log("user>>>>>>>>>>>>>>> ", req.user);
//   var contact_profile = {}
//   return subscription_utils.get_user_subscription(req.user._id)
  
// .then(function(subscription_status){
//   // subscription_status = false;
//   if (!subscription_status){
//     res.status(404).json({"message":"Please buy a plan"});
//     return;
//   }
//   console.log("subscription_status>>>>>>>>>>>>>>>>>>>>>>>> ", subscription_status)

//   Profile.findOne({user:req.params.id})
//   .populate('user')
//   .then(function(profile_data){
//     contact_profile = profile_data
//     return Profile.findOneAndUpdate({user:req.user._id}, {$addToSet:{viewed_contacts:profile_data._id}})

//   })
//   .then(function(data){
//     console.log("contact_profile>>>>>>>>>>>>>>>>>>>> ",data)
//     res.status(200).json({"data":contact_profile})

//   })
//   .catch(function(err){
//     console.log("err>>>>>>>>>>>>>>> ",err);
//     res.status(500).json({"message":"server error"})
//   })

// })
  
// }


async function update_interaction(my_id, contacted_user, contacted_profile, type){
  console.log("my_id ",my_id, "contacted_user", contacted_user, "contacted_profile", contacted_profile);
 const existing_interaction =  await Interaction.findOne({user:my_id, interacted_user:contacted_user, interaction_type:'contacted'});
 console.log("existing_interaction>>>>>>>>>>>>>> ",existing_interaction);
 if(existing_interaction){
   return false;
 }

  
  
  var new_interaction = new Interaction({
    interaction_type:type,
    user:my_id,
    interacted_user:contacted_user,
    interacted_profile:contacted_profile
  });

  const new_inter = await new_interaction.save();
  console.log("new_inter>>>>>>>>>>>>>>>> ", new_inter);
  return true; 
}





module.exports.get_data_for_subscribed_user = async (req, res) => {
  console.log("params>>>>>>>>>>>>>>> ",req.params);
  // console.log("user>>>>>>>>>>>>>>> ", req.user);
  try{

  
  const subscription = await subscription_utils.get_user_subscription(req.user._id);
  console.log("subscription>>>>>>>>>>>>>> ",subscription);
  if(!subscription){
    res.status(403).json({"message":"Please buy a plan"});
    return 
  }

  const contact_profile = await Profile.findOne({user:req.params.id}).populate('user');
  res.status(200).json({"data":contact_profile, "message":"success"});


  const new_updated_interaction = await update_interaction(req.user._id, contact_profile.user._id, contact_profile._id, type='contacted');
  console.log("new_updated_interaction>>>>>>>>>>>> ",new_updated_interaction);

  if(new_updated_interaction){
      const updated_subs_order = await Subscription_order.updateOne({_id:subscription._id},{$inc:{contacts_available:-1}})

  }
  
  }

  catch(e){
    console.log("e>>>>>>>>>>>>> ",e);
    
    if(!e.subscription){
      res.status(403).json({"message":"No valid subscription found. Please buy a subscription"})
    }
    else{
      res.status(500).json({"message":"Something went wrong"})
    }
    
  }
}



module.exports.get_viewed_contacts_of_user = function(req, res){

  Profile.findOne({user:req.user._id})
  .populate('viewed_contacts')
  .then(function(data){
    console.log("data is>>>>>>>>>>>>>>>>>> ", data);
    res.status(200).json({"data":data})
  })
  .catch(function(err){
    console.log("err*****************8  ",err)
    res.status(500).json({"message":"server error"})
  })
}



module.exports.sendmail  = async function(req,res){
  try{
    const mail_response =   await oauth_mailer.triggerMail(
      to="nitishkumar1500@gmail.com",
      subject="This is test subject",
      text="This is test text",
      html = "<h1>Hello World!!</h1>"
      );

  console.log("Mail Success response>>>>>>>>>>> ",mail_response);
  res.status(200).json({"data":mail_response, "message":"success"})
  }

  catch(e){
    console.log("Mail Error>>>>>>>>>>>>>>>> ",e);
    res.status(500).json({"message":e})
  }

}


module.exports.verify_email= async (req,res)  => {
   console.log("req.params>>>>>> ",req.params);
   const link = req.params.link;
   let port = 4000 || 80

   try{
     const payload = await jwt.verify(link, EMAIL_SECRET);
     console.log("payload>>>>>>>>>>> ",payload);
     const user = await User.findOne({_id:payload._id});
     if(user.email_verified){
       return res.redirect(`http://${config.prod_url}:${port}/register/status?status=verified`);
     }

     const user_update = await User.update({_id:payload._id},{$set: { email_verified: true }});
     const profile_update = await Profile.update({user:payload._id}, {$set:{email_verified:true}});
     return res.redirect(`http://${config.prod_url}:${port}/register/status?status=success`);
   }
   catch(e){
       console.log("error>>>>>>>> ",e);
       return res.redirect(`http://${config.prod_url}:${port}/register/status?status=failed`);
   }
   
}


function get_html_for_password_reset_mail(name, url){
  var html = `<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
<style>
body {
  background-color: #fff;
  padding-left:20px;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
</head>
<body>
<p>Hi ${name},</p>
<p>Please reset your password by clicking on this link<br> It will expire in 3 days</p>

<p>${url}</p>


Thanks <br>
<span style= 'padding-bottom:10px;'>Team Shaadikarlo<span>

</body>
</html>
`
return html;
}


module.exports.generate_password_reset_link = async (req, res) => {
  try{
    console.log("generating password reset link >>>>>>>>>>>>");
    const user = await User.findOne({"email":req.body.email});

    if(!user){
       res.status(400).json({"message": "User not exists with this email"}); 
    }

    const email_token = jwt.sign({_id:user._id.toString()}, EMAIL_SECRET, {expiresIn: '30d'});
    const password_reset_url = `http://${config.prod_url}+:${config.port}+/password/reset/${email_token}`;
    var html = get_html_for_password_reset_mail(user.name, password_reset_url)
      
    var password_mail = await oauth_mailer.triggerMail(to=user.email, subject="Reset Password Link", text="Click on the bllow link to reset password", html=html)

    res.status(200).json({"message":"password reset link has been sent to your email"})
  }
  catch(e){
    console.log("error>>>>>>>>>> ",e);
    res.status(500).json({"message": "Something went wrong"}); 

  }
  
}


module.exports.update_password = async (req, res) => {
  if(!req.params.link || !req.body.password){
    res.send({"message":"Invalid request!"});
    return;
  }
  try{
     console.log("updating password>>>>>>>>>>>>>> ", req.params);
     const payload = await jwt.verify(req.params.link, EMAIL_SECRET);

    const user = await User.findById({_id:payload._id});
    user.password = req.body.password;
    const updated_user =  await user.save();

    // const updated_user = await User.updateOne({_id:payload._id},{$set:{password:req.body.password}});
    console.log("updated_user>>>>>>>>>>> ",updated_user);
    res.status(200).send({"message":"Password updated successfully"})
  }
  catch(e){
    
      console.log("e>>>>>>>>> ",e);
      res.status(500).send({"message":"Something went wrong"});
   
  }
 
}




module.exports.send_email_verification = async (req,res) => {

  try{
     var user = await User.findOne({"email":req.body.email}); 

     if(!user){
       res.status(400).json({"message": "User not exists with this email"}); 
       return;
    }
    if(user.email_verified){
      res.status(400).json({"message":"Email verification already done"})
      return;
    }
    const userDetails = {};
    userDetails["email"] = user.email;
    userDetails["name"] = user.name;
    userDetails["id"] = user._id;
    user_util.send_email_verification_url(userDetails);
    res.status(200).json({"message":"Verification link sent to email"});
  }
  
  catch(e){
    console.log("err",e);
    res.status(500).json({"message":"Something went wrong. Please try after some time Or message the issue under contact us form"})
    return
  }
    
    
}