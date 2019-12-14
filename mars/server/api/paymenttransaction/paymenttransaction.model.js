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
  transaction_id:String,
  razorpay_response:{}

},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
);


// paymenttransactionSchema.methods.get_by_order_id_2 = function find_by_order_id (order_id,cb) {
//   return this.model('Paymenttransaction').find({ razorpay_order_id: this.order_id }, cb);
// };

paymenttransactionSchema.statics.get_by_order_id = function search (order_id, cb) {
  return this.where('razorpay_order_id', order_id).exec(cb);
}

paymenttransactionSchema.statics.get_by_transaction_id = function search (txn_id, cb) {
  return this.where('transaction_id', txn_id).exec(cb);
}

paymenttransactionSchema.statics.get_by_subscription_id = function search (sub_id, cb) {
  return this.where('transaction_id', sub_id).exec(cb);
}



var Paymenttransaction = mongoose.model('Paymenttransaction', paymenttransactionSchema);


module.exports = Paymenttransaction;
