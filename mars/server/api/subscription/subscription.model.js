var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var subscriptionSchema = new Schema({
  // user_id:Number,
  name: String,
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  
  name: String,
  description:String,
  type:{type:String, enum: ['basic','premium','gold', 'promotional']},
  is_active:Boolean,
  contacts_allowed:Number,
  duration:String,
  price:Number

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
var Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
// make this available to our users in our Node applications