
var express = require('express')
var router = express.Router()

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwt = require('jsonwebtoken');

var User = require('../api/user/user.model').User;


var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'this is super secret';


function getUser(username){
	return new Promise(function(resolve, reject){
	User.findOne({email:'Deborah.Koelpin@yahoo.com'})
      .then(function(user){
      	// console.log("users>>>>>>>>>>>>>>>>>>", user)
      	resolve(user)
      })
      .catch(function(err){
       	reject(err)
      })
	})
	
 }



var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  // var user = users[_.findIndex(users, {id: jwt_payload.id})];
  getUser(jwt_payload.username).then(function(user){

	  if (user) {
	    next(null, user);
	  } else {
	    next(null, false);
	  }
	});
})

passport.use(strategy);


router.post('/login', function(req, res){
  console.log("login api called>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.headers)
   console.log("login api called>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.body)
   if(!req.body.username){
      res.send({status:false, message:"Invalid credentials"});
   } else {
   		
      getUser(req.body.username)
      .then(function(user){
      	console.log("user**************** ", user);
      	if(user.email==req.body.username){

      		
      		const payload = {
				user_id: user._id,
				username: user.email
			};
			var token = jwt.sign(payload, "this is super secret", {expiresIn: '10h'})
			user.token = token
			req.session.user = user
			console.log("payload>>>>>>>>>>>>>>>>>>>>> ",payload)
			res.json({
				status:true,
				token:token
			})
      	}
      	else{
      	res.json({
				status:false,
				"message":"Login failed"
			})
      	}

      })
      .catch(function(err){
      	console.log("err>>>>>>>>>>>>>>> ", err)
      	res.redirect('/login')
      })
   }
});

router.post('/profile', passport.authenticate('jwt', { session: false }), function(req, res){
	
	User.find().then(function(allUser){
		res.send({"data":allUser})
	})
	// next();

}, function(req, res){
	res.json({"sess": req.sessionasas})
})

// router.post('signup', {})

module.exports = router