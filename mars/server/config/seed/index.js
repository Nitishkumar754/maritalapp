'use strict'

var faker = require('faker');
var Q = require('q');
var profileArray = [];

module.exports.seedDatabase = function() {

  //all models
  var User = require('../../api/user/user.model').User;
  var Profile = require('../../api/profile/model');
  

  var defered = Q.defer();

  User.insertMany(require('./user.seed.js')())

  .then(function(){
    console.log("User Seeding done!")
  	var profilePromise = require('./profile.seed.js')()
    profilePromise.then(function(data){
      console.log("data>>>>>>>>>>>>>>>>>>>> ",data);
      return Profile.insertMany(data)
    })
    
  	
  })
  .then(function() {
  	console.log("Profile Seeding done!")
      defered.resolve();
    });
   return defered.promise;

}
