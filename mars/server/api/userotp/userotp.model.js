const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const moment = require('moment');

var userotpSchema = new Schema({
  name: {type:String},

  user:{type:ObjectId, ref:'users'},

  mobile_number:{type:String},

  email : {type:String},
  
  otp :{type:String},

  active:  {type:Boolean},
  
  expiresIn: {type:Date}
  
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

userotpSchema.statics.SaveEmailOtp = async function(email, otp, type=null){
  if(!email || !otp) return;
   console.log("email", email, "otp****", otp);

  if(type=='password_reset'){
  	let expire_time = moment().add(15, 'minutes').toDate();
  	const otpObj = await this.create({email:email, otp:otp, active:true, created_at:new Date(), expiresIn:expire_time});
  	return otpObj;
  }
  else{ //registration
	  await this.deleteMany({email:email});
	  let expire_time = moment().add(3, 'days').toDate();
	  const otpObj = await this.create({email:email, otp:otp, active:true, created_at:new Date(), expiresIn:expire_time});
	  return otpObj;
  }
  
}

var Otp = mongoose.model('userotp', userotpSchema);

module.exports = Otp;
