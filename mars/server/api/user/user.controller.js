var User = require('./user.model').User;
var Profile = require('../profile/model');
var User_OTP = require('./user.model').User_OTP;
var mongoose = require('mongoose');
var subscription_utils = require('../subscription_order/subscription_order.utils');

var user_util = require('./user.utils');
var bcrypt_util = require('./bcrypt_utils');

var mailer = require("../../lib/mail.js");

var oauth_mailer = require('../../lib/oauth_mail');

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
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


async function create_profile(user_id,dob,gender){
  var g='';
  if(gender=='male'){
      g = 'm';
  }
  if (gender=='female'){
      g = 'f';
  }
return Profile.findone_or_create({user:user_id,display_name:makeid(6),dob:dob,gender:g})
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
    
    const users = await User.find({
        email: request_data.email,
        email_verified:true
      })
    console.log("users>>>>>>>>>>>>> ",users);
    if (users.length){
       res.status(500).send({"error":"This email is already registered!"}); 
       return
    }

    var user = new User ();
    user_register_body.forEach((key) => user[key] = req.body.user[key])

    try{

      const user_data = await user.save();

      console.log("user_data>>>>>>>>>>>> ", user_data);
      const profile_data = await create_profile(user_data._id, req.body.user['dob'],req.body.user['gender'])
      console.log("profile_data>>>>>>>>>>>> ",profile_data);

      userDetails["email"] = user_data.email;
      userDetails["name"] = user_data.name;
      userDetails["id"] = user_data._id;

      const email_token = jwt.sign({_id:user._id.toString()}, EMAIL_SECRET, {expiresIn: '3d'});
      
      const email_verification_url = `http://localhost:4000/api/user/email/confirmation/${email_token}`;

      const sendData = await user_util.sendOtp(userDetails, email_verification_url);
      console.log("sendData>>>>>>>>> ",sendData);



      res.status(200).send({
        "status":true, message:"Please verify the email"})
      
    }
    catch(e){
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
    // console.log("searchQuery>>>>>>>>>> ",searchQuery);
    // console.log("options>>>>>>>>>>>>> ",JSON.stringify(options));
    // console.log("match>>>>>>>>>>>>>>>>>>> ",JSON.stringify(match));
    // console.log("skip>>>>>>>>>>>>>>>>>>> ",JSON.stringify(skip));
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
  console.log("req.body>>>>>>>>>>>>>> ", req.body);
  var data = req.body;

  var encrypted_password = bcrypt_util.password_hash(data.password);
  encrypted_password.then(function(hashed_password){
    console.log("hashed_password>>>>>>>>>>>>>>>>>>> ",hashed_password);
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
        address:address,
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


module.exports.get_data_for_subscribed_user = function(req, res){
  console.log("params>>>>>>>>>>>>>>> ",req.params);
  // console.log("user>>>>>>>>>>>>>>> ", req.user);
  var contact_profile = {}
  return subscription_utils.get_user_subscription(req.user._id)
  
.then(function(subscription_status){
  // subscription_status = false;
  if (!subscription_status){
    res.status(404).json({"message":"Please buy a plan"});
    return;
  }
  console.log("subscription_status>>>>>>>>>>>>>>>>>>>>>>>> ", subscription_status)

  Profile.findOne({user:req.params.id})
  .populate('user')
  .then(function(profile_data){
    contact_profile = profile_data
    return Profile.findOneAndUpdate({user:req.user._id}, {$addToSet:{viewed_contacts:profile_data._id}})

  })
  .then(function(data){
    console.log("contact_profile>>>>>>>>>>>>>>>>>>>> ",data)
    res.status(200).json({"data":contact_profile})

  })
  .catch(function(err){
    console.log("err>>>>>>>>>>>>>>> ",err);
    res.status(500).json({"message":"server error"})
  })

})
  
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


module.exports.verify_email_link = async (req,res)  => {
   console.log("req.params>>>>>> ",req.params);
   const link = req.params.link;
   let port = 4200 || 80

   try{
     const payload = await jwt.verify(link, EMAIL_SECRET);
     console.log("payload>>>>>>>>>>> ",payload);
     const user = await User.findOne({_id:payload._id});
     if(user.email_verified){
       return res.redirect(`http://${req.hostname}:${port}/register/status?status=verified`);
     }

     const user_update = await User.update({_id:payload._id},{$set: { email_verified: true }})
     return res.redirect(`http://${req.hostname}:${port}/register/status?status=success`);
   }
   catch(e){
       console.log("error>>>>>>>> ",e);
       return res.redirect(`http://${req.hostname}:${port}/register/status?status=failed`);
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

    const email_token = jwt.sign({_id:user._id.toString()}, EMAIL_SECRET, {expiresIn: '3d'});
    const password_reset_url = `http://${config.client_url}/password/reset/${email_token}`;
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


