// appid: 1071935582966920
//app-secret:ca62467f51238e94b72d55e99ce557b4
//"callback":"http://localhost:4000/auth/facebook/callback"

const express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');

var User = require('../api/user/user.model');


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


passport.use('facebook', new FacebookStrategy({
  clientID        : '1071935582966920',
  clientSecret    : 'ca62467f51238e94b72d55e99ce557b4',
  callbackURL     : 'http://localhost:4000/auth/facebook/callback'
},
 
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
    // asynchronous
    console.log("profile>>>>>>>>>>>>>> ",profile)
    console.log("access_token>>>>>>>>>>>>> ",access_token)
    console.log("refresh-token>>>>>>>>>>> ", refresh_token)
    process.nextTick(function() {

  //     { id: '1402342829901514',
  // username: undefined,
  // displayName: 'Rahul Kumar',
  // name: 
  //  { familyName: undefined,
  //    givenName: undefined,
  //    middleName: undefined },
  // gender: undefined,
  // profileUrl: undefined,
  // provider: 'facebook',
  // _raw: '{"name":"Rahul Kumar","id":"1402342829901514"}',
  // _json: { name: 'Rahul Kumar', id: '1402342829901514' } }

     
      // find the user in the database based on their facebook id
      User.findOne({fbId: profile.id}, function(err, user) {
        console.log("user>>>>>>>>>>>>>>> ", user)
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
 
            // set all of the facebook information in our user model
            newUser.fbId    = profile.id; // set the users facebook id 
            newUser.fbName = profile.displayName
            newUser.fbAccessToken = access_token                
            // newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user                    
            // newUser.fb.firstName  = profile.name.givenName;
            // newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
            // newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            console.log("newUser>>>>>>>>>>>>>> ",newUser)
 
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
         } 
      });
    });
}));

// router.get('/auth/facebook', 
//   passport.authenticate('facebook', { scope : 'email' }
// ));
 
// handle the callback after facebook has authenticated the user
// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect : '/loginsuccess',
//     failureRedirect : '/loginerror'
//   })
// );

router.get('/auth/facebook', (req, res, next) => {
  passport.authenticate('facebook')(req, res, next)
})


router.get("/auth/facebook/callback", (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    console.log("is user>>>>>>>>>>>>>>>>> ", user)
    if (err) { return next(err); }
    if (!user) { return res.redirect('/loginerror')}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/api/users/' + user._id)
    });
  })(req, res, next)
})

module.exports = router;