var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileId = mongoose.Types.ObjectId();

var partner = new Schema({
    min_age:String,
    max_age:String,
    body_type:Array,
    complexion:Array,
    min_height:String,
    max_height:String,
    diet:Array,
    religion:Array,
    caste:Array,
    education:Array,
    occupation:Array,
    annual_income:String,
    marital_status:Array

})

var profileSchema = new Schema({
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  display_name:String,
  description:String,
  gender: String,
  height:String,
  dob: Date,
  caste:String,
  sub_caste:String,
  sect:String,
  occupation:String,
  raasi:String,
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
  higher_education:String,
  interest:String,
  profile_images:Array,
  // address:{ type : Array , "default" : [] },
  // profile_application_status:{type:String, enum: ['init','incomplete','submitted', 'approved', 'rejected']},
  profile_changed_timestamp:Date,
  profile_status:{type:String, enum:['pending', 'rejected', 'approved', 'disabled'], default:'pending'},
  viewed_contacts:[{ type: Schema.ObjectId, ref: 'Profile' }],
  partner:partner,
  email_verified:Boolean,
  addressline:String,
  occupation_type:String,
  college_name:String,
  birth_place:String,
  family_income:String,
  profile_visitor:[],
  shared_link:String

  


},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})


profileSchema.statics.findone_or_create = function (condition, callback) {
   console.log("condition>>>>>>>>>> ", condition)
    return this.findOne({user:mongoose.Types.ObjectId(condition['user'])}, (err, result) => {
      console.log("result>>>>>>>>>>> ",result, "err", err)
        
        return result ? new Promise(function(resolve, reject){
          resolve(result)
        }) : this.create(condition)
    })
    
}

var Profile = mongoose.model('Profile', profileSchema);

// make this available to our users in our Node applications
module.exports = Profile;
 