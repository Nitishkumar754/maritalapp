var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
var config = require('../../config/environment');

var fbSchema = new Schema({
	id:String
});

var Fb = mongoose.model('fb', fbSchema)
// create a schema
var userSchema = new Schema({
  // user_id:Number,
  name: {
    type: String,
    required:true,
    lowercase:true

  },
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  
  fbId: String,
  fbName:String,
  fbAccessToken:String,
  
  username:String,
  password:String,
  email:{
    type: String,
    required:true,
    lowercase:true,
    validate(email){
      console.log("value>>>>>>>>>>>>>>>>>> ",email)
      if(!validator.isEmail(email)){
        throw new Error('Not a valid email')
      }
    }
 },
  mobile_number:{type: String, required:true},
  role:String,
  is_active:Boolean,
  mobile_verified:{type: Boolean, default: false},
  email_verified:{type: Boolean, default: false},
  created_by:{type:String, default:'user'},
  address:new Schema({addressline1:String, addressline2:String, pincode:String, city:String, state:String})
  

},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
);

 
userSchema.methods.generateAuthToken = async function() {
  
  const user = this;
  const token = jwt.sign({_id:user._id.toString(),role:user.role}, config.secrets.secret,{expiresIn: '10h'})
  return token;
}

userSchema.methods.generateAdminAuthToken = async function() {
  
  const user = this;
  const token = jwt.sign({_id:user._id.toString(),role:user.role}, config.secrets.adminsecret,{expiresIn: '100h'})
  return token;
}

userSchema.statics.findByCredentials = async (email, password) =>  {
  console.log("email, password>>>>>>>>>>>> ", email, password);
  const user = await User.findOne({email:email})
  
  if(!user){
    return {status:false, 
            message:"Email not found"};
  }


  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch){
    return {status:false, "message":"Incorrect password"};
  }
  if(!user.email_verified){
    return{status:false,"message":"Email not verified"}
  }
  return user;

}



// Hashing Password before storing
userSchema.pre('save', async function(next){

  const user = this;
  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }
  console.log("saving user password>>>>>>>>>>>>>>>>>>>> ")
  next();

})


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

