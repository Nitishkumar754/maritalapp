var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var paymentintentSchema = new Schema({
  // user_id:Number,
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  subscription: {type: mongoose.Schema.ObjectId, ref:'Subscription'},
  subscription_price:Number,
  status:{type:String, enum: ['init','failed','gold']},

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
var Paymentintent = mongoose.model('Paymentintent', paymentintentSchema);

module.exports = Paymentintent;

// make this available to our users in our Node applications
