var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileId = mongoose.Types.ObjectId();

var profileSchema = new Schema({
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  display_name:String,
  gender: ['M', 'F'],
  height:String,
  dob: Date,
  cast:String,
  sect:String,
  occupation:String,
  company:String,
  blood_group:String,
  languages: String,
  email:String,
  mobile:String,
  profile_image:String,
  marital_status:String,
  district:String,
  state:String,
  country:String,
  religion:String,
  city:String,
  weight:String,
  father_occupation:String,
  mother_occupation:String,
  annual_income:String,
  no_of_brothers:String,
  no_of_sisters:String,
  diet:String,//veg, non-veg, eggatarian
  smoke:String,
  drink:String,
  complexion:String,
  profile_managed_by:String,
  body_type:String,
  mother_tongue:String,
  hometown:String,
  physically_challenged:String,
  education:String,
  interest:String,
  profile_images:Array,
  address:{ type : Array , "default" : [] },
  profile_status:{type:String, enum: ['incomplete','submitted', 'approved', 'rejected']},
  profile_changed_timestamp:Date

},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})


var Profile = mongoose.model('Profile', profileSchema);

// make this available to our users in our Node applications
module.exports = Profile;
 