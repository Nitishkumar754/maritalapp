
var SubscriptionOrder = require('./subscription_order.model');


module.exports.get_all_subscription_of_user  = function(req, res){
	
	if (req.params.id && req.params.id!='mine'){
		user_id = req.params.id
	}
	else{
		user_id = req.user._id
	}

	SubscriptionOrder.find({user:user_id})
	.populate(['user', 'paymenttransaction'])
	.then(function(data){
		// console.log("data>>>>>>>>>>>>>>>>> ", data);
		res.status(200).json({"subscription_order":data, status:true})
	})
	.catch(function(err){
		res.status(500).json({"subscription_order":[],"message":"Server error"})
	})
}

module.exports.get_all_subscription_orders  = function(req, res){
	console.log("req.params>>>>>>>>>>>>> ", req.params);
	SubscriptionOrder.find({})
	.populate(['user', 'paymenttransaction'])
	.then(function(data){
		console.log("data>>>>>>>>>>>>>>>>> ", data);
		res.status(200).json({"orders":data, status:true})
	})
	.catch(function(err){
		res.status(500).json({"message":"Server error", status:false})
	})
}