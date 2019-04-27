
var express = require('express')
var router = express.Router()

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwt = require('jsonwebtoken');

var User = require('../server/user/user.model')


var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'this is super secret';


function getUser(username){
	return new Promise(function(resolve, reject){
	User.find({username:username})
      .then(function(users){
      	resolve(users)
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
   
   if(!req.body.username || !req.body.password){
      res.send("Invalid credentials");
   } else {
   		
      getUser(req.body.username)
      .then(function(user){
      	
      	if(user[0].username==req.body.username){

      		
      		const payload = {
				user_id: user[0]._id,
				username: user[0].username
			};
			var token = jwt.sign(payload, "this is super secret", {expiresIn: '10h'})
			user[0].token = token
			req.session.user = user[0]
			console.log("payload>>>>>>>>>>>>>>>>>>>>> ",payload)
			res.json({
				success:true,
				token:token
			})
      	}
      	else{
      	res.json({
				success:false,
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