var Paymentintent = require('../paymentintent/paymentintent.model');
var Paymenttransaction = require('./paymenttransaction.model');
// var Subscription = require('../subscription/subscription.model');
var subscription_utils = require('../subscription/subscription.utils');

var Razorpay = require('razorpay');

var rz_key = "rzp_test_0TDe2Q1HQmkcZ2";
var rz_secret = "VYsPY7U9YSyb5sTECnoj7lJo";

var uuid = require('uuid');
var crypto = require('crypto');
var razorpay = new Razorpay({
  key_id: rz_key,
  key_secret: rz_secret
})

var razorpay_utils = require('../../razorpay/razorpay_utils');

module.exports.create_payment_order = function(req, res){
  // console.log("req.body for payment >>>>>>>>>>>>>>>>>>>>>> ",req.body);
  // console.log("req.user>>>>>>>>>>> ", req.user);
  var request_body = req.body;
  var subscription_id  = request_body.subscription_id

  var transaction_id = uuid.v1();
  var misc_obj = {}

	if(!subscription_id){
		res.status(400).json({"message":"Missing subscription id "})
		return;
	}

	subscription_utils.get_subscription_by_id(subscription_id)
	.then(function(subscription){
		if (!subscription){
			res.send(400).json({"messsage":"subscription not found"})
			return
		}

		misc_obj["subscription"] = subscription
		return razorpay_utils.razorpay_create_order(subscription.price, 'INR', transaction_id, 1, {"message":"payment for marital"})
	})
	.then(function(razorpay_data){
		misc_obj['razorpay_data'] = razorpay_data;
		var paymenttransaction = new Paymenttransaction({
			user:req.user._id,
			subscription:misc_obj.subscription._id,
			amount:misc_obj.subscription.price,
			payment_method:'razorpay',
			status:'init',
			razorpay_order_id:razorpay_data.id,
			transaction_id:razorpay_data.receipt
		})
		return paymenttransaction.save()
	})
	.then(function(payment_txn){
		console.log("payment_txn>>>>>>>>>>>>>>>>>> ",payment_txn);
		misc_obj['user'] = {'name':req.user.name, 'mobile':req.user.mobile_number, 'email':req.user.email}
		res.status(200).json({"message":"success", status:true, data:misc_obj})
		return;

	})
	.catch(function(err){
			console.log("err2>>>>>>>>>>>>>>>>>>>>>> ", err);
			res.status(500).json({"message":"Server encountered an error"})
			return
	})

 
}


module.exports.verify_razorpayment_order = function(req, res){
	console.log("payment_body>>>>>>>>>>>>>>>>>>>> ", req.body);
	var razorpay_order_id = req.body.razorpay_order_id;
	var razorpay_payment_id = req.body.razorpay_payment_id;
	
	var generated_signature = crypto.createHmac('sha256',rz_secret)
	.update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');
	
	console.log("generated_signature>>>>>>>>>>>>>>> ", generated_signature);

	if (generated_signature == req.body.razorpay_signature) {   
		console.log(" payment is successful>>>>>>>>>>>>>>>>>>> ") 
	}
	res.status(200).json({"message":"success"});
}