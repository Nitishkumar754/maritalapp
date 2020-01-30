var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var fbSchema = new Schema({
	id:String
});

var Fb = mongoose.model('fb', fbSchema)
// create a schema
var userSchema = new Schema({
  // user_id:Number,
  name: String,
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  
  fbId: String,
  fbName:String,
  fbAccessToken:String,
  
  username:String,
  password:String,
  email:String,
  mobile_number:String,
  role:String,
  last_active:Date,
  is_active:Boolean,
  mobile_verified:{type: Boolean, default: false},
  email_verified:{type: Boolean, default: false},
  created_by:{type:String, default:'user'},
  address:new Schema({addressline1:String, addressline2:String, pincode:String, city:String, state:String}),
  last_active_timestamps:Date

},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
);

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications


var UserOTPSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  otp: {
    type: String
  },
  active: {
    type: Boolean
  }
  // ,
  // count: Number,
  // ip:String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


var User_OTP =  mongoose.model('user_otp', UserOTPSchema);

module.exports = {
    User: User,
    User_OTP: User_OTP
}

