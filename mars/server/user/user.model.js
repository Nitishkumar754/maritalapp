var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var fbSchema = new Schema({
	id:String
});

var Fb = mongoose.model('fb', fbSchema)
// create a schema
var userSchema = new Schema({
  profile_id: Number,
  user_id:Number,
  name: String,
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  created_at: Date,
  updated_at: Date,
  fbId: String,
  fbName:String,
  fbAccessToken:String,
  username:String,
  password:String
  



});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;


// var profileSchema = new Schema({
//   profile_id:Number,

//   created_at: Date,
//   updated_at: Date,
//   display_name:String,
//   gender: ['M', 'F'],
//   height:String,
//   dob: Date,
//   cast:String,
//   sect:String,
//   occupation:String,
//   company:String,
//   blood_group:String,
//   languages: [],
//   email:String,
//   mobile:String,
//   image_url:String,
//   marital_status:String,
//   district:String,
//   state:String,
//   country:String


// })


// var Profile = mongoose.model('Profile', profileSchema);

// // make this available to our users in our Node applications
// module.exports = Profile;
//  