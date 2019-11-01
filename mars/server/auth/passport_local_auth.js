var express = require('express')
var router = express.Router()
var app  = express();
var bCrypt = require('bcrypt');
var passport = require('passport')

var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var express = require('express')
var router = express.Router()

var User = require('../server/user/user.model')


passport.serializeUser(function(user, done) {
	// console.log("inside serializeUser >>>>>>>>>>>> ", user)
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
	
  User.findById(id, function(err, user) {
  	
    done(err, user);
  });
});


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


// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
  	
  	
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
      	
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        // if (!isValidPassword(user, password)){
        //   console.log('Invalid Password');
        //   return done(null, false, 
        //       req.flash('message', 'Invalid Password'));
        // }
        // User and password both match, return user from 
        // done method which will be treated like success

        return done(null, user);
      }
    );
}));


passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);


var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


// router.get('/', function(req, res) {
//     // Display the Login page with any flash message, if any
//     res.render('index', { message: req.flash('message') });
//   });
 

router.get('/', function(req, res) {
	res.send({message:"Login error"})
    // Display the Login page with any flash message, if any
    // res.render('index', { message: req.flash('message') });
});
 

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    
    failureRedirect: '/',
    failureFlash : true 
  }), function(req, res){
  	
  	res.redirect(307,'/home')
  });
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

router.post('/home', isAuthenticated,  function(req, res){
	
	console.log("req.isAuthenticated()>>>>>>>>>>>> ", req.isAuthenticated())
	res.send({"message":"Login succesful"})
})
  module.exports = router