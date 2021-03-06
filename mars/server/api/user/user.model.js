var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
var config = require('../../config/environment');
const messageMapper = require('../../lib/messageMapper');
const UserMessage = messageMapper.language1;


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
      if(!validator.isEmail(email)){
        throw new Error('Not a valid email')
      }
    }
 },
  mobile_number:{type: String, required:true, unique:true},
  role:{type: String, default: "user"},
  is_active:{type:Boolean, default:true},
  mobile_verified:{type: Boolean, default: false},
  email_verified:{type: Boolean, default: false},
  created_by:{type:String, default:'user'},
  address:new Schema({addressline1:String, addressline2:String, pincode:String, city:String, state:String}),
  last_active:{type: Date, default:new Date()}

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
  const token = jwt.sign({_id:user._id.toString(),role:user.role}, config.secrets.secret,{expiresIn: '30d'})
  return token;
}

userSchema.methods.generateAdminAuthToken = async function() {
  
  const user = this;
  const token = jwt.sign({_id:user._id.toString(),role:user.role}, config.secrets.secret,{expiresIn: '30d'})
  return token;
}

userSchema.statics.findByCredentials = async (username, password) =>  {
  try{
    let user = await User.find({$or:[{email:username}, {mobile_number:username}]});
    if(!user || user.length==0) {
      return {status:false, message: UserMessage.missingEmailOrMobile };
    }
    user = user[0];
    if(user.email_verified || user.mobile_verified){
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
          return {status:false, "message":UserMessage.incorrectPassword};
        }
      return user;
    }
    else{
      return {status:false, "message":UserMessage.emailOrMobileNotVerified};
    }
  }
  catch(e){
    console.log("e******", e)
     return{status:false,"message":UserMessage.unknownError,"error":e.message}; 
  }
  
 

}


userSchema.statics.isEmailExits = async function(email){
   if(!email) return false;
   return User.findOne({email})
 }

userSchema.statics.isMobileExits = async function(mobile_number){
   if(!mobile_number) return false;
   return User.findOne({mobile_number})
 }

// Hashing Password before storing
userSchema.pre('save', async function(next){

  const user = this;
  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }
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

