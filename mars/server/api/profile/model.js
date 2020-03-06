var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileId = mongoose.Types.ObjectId();

var profileSchema = new Schema({
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  display_name:String,
  gender: String,
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
  profile_application_status:{type:String, enum: ['init','incomplete','submitted', 'approved', 'rejected']},
  profile_changed_timestamp:Date,
  is_approved:Boolean,
  viewed_contacts:[{ type: Schema.ObjectId, ref: 'Profile' }],
  partner_preferences:{}


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
 