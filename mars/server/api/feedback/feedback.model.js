var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');

var config = require('../../config/environment');

var feedbackSchema = new Schema({
  // user_id:Number,
  name: {
    type: String,
    required:true,
    lowercase:true

  },
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
  mobile_number:{type: String, required:true},
  message_type:{
    type:String,
  },
 message:{
   type:String,
   required:true,
   lowercase:true
 }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
);

 
 var Feedback = mongoose.model('Feedback', feedbackSchema);

// make this available to our users in our Node applications
module.exports = Feedback;