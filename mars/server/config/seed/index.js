'use strict'

var faker = require('faker');
var Q = require('q');
var profileArray = [];

module.exports.seedDatabase = async function() {

  //all models
  var User = require('../../api/user/user.model').User;
  var Profile = require('../../api/profile/model');
  

  var defered = Q.defer();

  await User.deleteMany({role:'user'});
  await Profile.deleteMany({});
  await User.insertMany(require('./user.seed.js')())
   console.log("User Seeding done!")
  var profilePromise = require('./profile.seed.js')();

    profilePromise.then(async function(data){
       await Profile.insertMany(data)
    })
    


  // console.log("Profile Seeding done!")

  // .then(function(){
  //   console.log("User Seeding done!")
  	
  //   profilePromise.then(function(data){
  //     // console.log("data>>>>>>>>>>>>>>>>>>>> ",data);
  //     return Profile.insertMany(data)
  //   })
    
  	
  // })
  // .then(function() {
  // 	console.log("Profile Seeding done!")
  //     defered.resolve();
  //   });
  //  return defered.promise;

}
