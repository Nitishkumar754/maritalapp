var User = require('./user.model').User;
var Profile = require('../profile/model');
var User_OTP = require('./user.model').User_OTP;
var mongoose = require('mongoose');

console.log("user>>>>>>>>>>>>>> ",User.User);
var user_util = require('./user.utils');

module.exports.getOwnProfile = function (req, res) {
  console.log("req.user>>>>>>>>>>>>>>> ", req.user);
	console.log("req.params>>>>>>>>>>>>>>>>  ",req.params.id)
  var id = mongoose.Types.ObjectId(req.user._id);
	Profile.findOne({user_id:id}, function(err, data){
		console.log("finally here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data)
		if (!data){
			res.json({"message":"User not found"})
			return

		}
		res.json({"data":data, message:"Success"})
	})
	
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


module.exports.register_new_user = function(req, res) {
	console.log("headers>>>>>>>>>>>>>>> ",req.headers);
	console.log("req.body>>>>>>>>>>>>>>>>>>>>>>> ",req.body.user);
  if (req.body.user) {
    var data = req.body.user;
    var userDetails = {};
    console.log("mobile_number>>>>>>>>>>>>> ", data.mobile_number);
    User.find({
        email: data.email
      })
      .then(function(users) {
      	console.log("users>>>>>>>>>>>>> ",users);
        if (users.length > 0) {
          userDetails = {
            id: users[0]._id,
            mob: users[0].mobile_number
          };
          res.status(500).send({"error":"This email is already registered!"});
          return;
         
        } else {
          var user = new User({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            mobile: data.mobile_number,
            role: 'user',
            is_active: true
          });
          user.save()
            .then(function(data) {
            	console.log("data>>>>>>>>>>>>>> ",data);
              userDetails = {
                id: data._id,
                mob: data.mobile_number
              };
              var sendData = user_util.sendOtp(userDetails);
              sendData.then(function(response) {
                  res.status(200).send({"status":true, message:"Please enter the otp sent to your email", user:data._id});
                })
                .catch(function(error) {
                  console.log(error);
                  res.status(500).send({status:false, message:"Error in creating user account"});
                })
            })
            .catch(function(error) {
              console.log(error);
              res.status(500).send({status:false, message:"Error in creating user account"});
            })
        }
      })
      .catch(function(error) {
        res.status(500).send("failed to verify mobile number");
      })
  } else {
    res.status(500).send("user details are present in body");
  }
}


module.exports.verify_otp = function(req,res){
	console.log("headers>>>>>>>>>>>> ",req.headers);
	console.log("req.body>>>>>>>>>>>>>>> ", req.body);
	if(!req.body || !req.body.user_id){
		return res.status(400).send({status:false, "error":"User id missing in request"})
	}
	if(!req.body.otp){
		return res.status(400).send({status:false, "error":"Otp missing in request"})
	};
	
	var id = mongoose.Types.ObjectId(req.body.user_id);
	
	console.log("id>>>>>>>>>>>>>>> ",req.body.user_id);
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

