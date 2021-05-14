var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var subscription_orderSchema = new Schema({
  // user_id:Number,
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  subscription:{},
  paymenttransaction:{type: mongoose.Schema.ObjectId, ref:'Paymenttransaction'},
  status:String,
  contacts_available:{ type: Number },
  // description:String,
  // type:{type:String, enum: ['basic','premium','gold']},
  // is_active:Boolean,
  // contacts_allowed:Number,
  // duration:String,
  // price:Number
  expiryDate: {type:Date},
  promotional:{type:Boolean,default:false}

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
var Subscription_order = mongoose.model('Subscription_order', subscription_orderSchema);

module.exports = Subscription_order;
// make this available to our users in our Node applications