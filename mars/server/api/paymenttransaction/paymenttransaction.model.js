var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// create a schema
var paymenttransactionSchema = new Schema({
  // user_id:Number,
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  subscription: {type: mongoose.Schema.ObjectId, ref:'Subscription'},
  amount:Number,
  status:{type:String, enum: ['init','failed','success']},
  // razorpay_request:new Schema({order_id:String, order_details:String}),
  // razorpay_response:new Schema({payment_id:String, payment_details:String}),
  razorpay_order_id:String,
  razorpay_payment_id:String,
  payment_method : String,
  refund_id : String,
  transaction_id:String

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
var Paymenttransaction = mongoose.model('Paymenttransaction', paymenttransactionSchema);

module.exports = Paymenttransaction;

// make this available to our users in our Node applications
