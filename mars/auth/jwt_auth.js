var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken');
var User = require('../server/user/user.model')

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

var Users = [];

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

function isUserExist(username){
	verifyuser = getUser(username)
    isUser = ''
	return verifyuser.then(function(user){
      	
      	if(user[0].username.toLowerCase()==username.toLowerCase()){
      		
      		return true
      	}
      	return false
    })
    .catch(function(err){
      	console.log(err)
      	return false
    })
}


router.post('/signup', function(req, res){

	if(!req.body.username || !req.body.password){
      res.status("400");
      res.send("Invalid details!");
   } else {

      getUser(req.body.username)
      .then(function(user){
      	if(user.length >0 && user[0].username==req.body.username){
      		res.send({"error":"User Already Exists! Login or choose another username"})
      	}
      	else{
      		var newUser = {username: req.body.username, password: req.body.password, id:req.body.id};
      			User.create(newUser).then(function(user){
      				res.send({"message":"Registration successful. Please login"})
      			})		
      	}

      })
      .catch(function(err){
      	console.log("err>>>>>>>>>>>>>>> ", err)
      	res.send({"error": "Server error"})

      })

   }
})

//for session authentication

function checkSignIn(req, res, next){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

//for token authentication

function verifyToken(req, res, next){
	const bearerhead = req.headers['authorization']
	if(bearerhead !==undefined){
		const bearer = bearerhead.split(' ');
		const bearerToken = bearer[1];
		// req.token = bearerToken;

		jwt.verify(bearerToken, "this is super secret", function(err, data){
		if(err){
			res.send({"error":err})
			return
		}
		req.user = data
		next();
		});
	}

	else {
		res.send({error:"Forbidden"})
	}
}

router.post('/login', function(req, res){
   console.log(Users);
   
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
			res.json({
				success:true,
				token:token
			})
      	}

      })
      .catch(function(err){
      	console.log("err>>>>>>>>>>>>>>> ", err)
      	res.redirect('/login')
      })
   }
});


router.post('/profile', verifyToken, function(req, res){
	
	User.find().then(function(allUser){
		console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>> ",allUser)
		res.send({"data":req.user})
		// return
	})
	// next();

}, function(req, res){
	res.json({"sess": req.sessionasas})
})

module.exports = router
