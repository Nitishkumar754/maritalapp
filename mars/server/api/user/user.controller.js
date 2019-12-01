var User = require('./user.model').User;
var Profile = require('../profile/model');
var User_OTP = require('./user.model').User_OTP;
var mongoose = require('mongoose');


var user_util = require('./user.utils');
var bcrypt_util = require('./bcrypt_utils');

module.exports.getOwnProfile = function (req, res) {
  console.log("req.user>>>>>>>>>>>>>>> ", req.user);
	console.log("req.params>>>>>>>>>>>>>>>>  ",req.params.id)
  var id = mongoose.Types.ObjectId(req.user._id);
	Profile.findOne({user:id}, function(err, data){
		// console.log("finally here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data)
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
    console.log("searchQuery>>>>>>>>>> ",searchQuery);
    console.log("options>>>>>>>>>>>>> ",JSON.stringify(options));
    console.log("match>>>>>>>>>>>>>>>>>>> ",JSON.stringify(match));
    console.log("skip>>>>>>>>>>>>>>>>>>> ",JSON.stringify(skip));
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