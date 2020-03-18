
const SubscriptionOrder = require('./subscription_order.model');
const Subscription  = require('../subscription/subscription.model');
const paymenttransaction_utils = require('../paymenttransaction/paymenttransaction.utils');

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

module.exports.create_promotional_order = async (req,res) =>{
	console.log("req.body>>>>>>>>>> ",req.body);

	if(!req.body.subs_id){
		res.status(403).json({"message":"Invalid request"});

	}
	try{
		const subscription = await Subscription.findOne({_id:req.body.subs_id});
		console.log("subscription>>>>>>>>>>>>> ",subscription);
		if(!subscription){
			console.log("subscription1 >>>>>>>>>>>>>>>>>> ")
			res.status(404).json({"message":"No such plan exits"});
			return;
		}
		console.log(`subscription.type!==promotionsal>>>>>>>>>>> ${subscription.type} ${subscription.type!=='promotional'}`)
		if(subscription.type !=='promotional' || subscription.is_active==false){
			console.log("subscription2 >>>>>>>>>>>>>>>>>> ", subscription.type!=='promotional', subscription.is_active==false)
			res.status(404).json({"message":"No such promotional plan exists"});
			return;
		}
		//one more condition to check if promotional plan has been used or not
		console.log("subscription>>>>>>>> ",subscription);


				var susbcription_data = paymenttransaction_utils.map_subscription_data(subscription)

				var subscription_order = new SubscriptionOrder({
					user:req.user._id,
					subscription:susbcription_data,
					status:'success',
					contacts_available:susbcription_data.contacts_allowed,
					promotional:true
				})
		const new_subscription_order = await subscription_order.save()

		
		res.status(200).json({"message":"Subscription to promotional plan is success"});
		return;
	}
	catch(e){
		console.log("e>>>>>>>>>> ",e);
		res.status(500).json({"message":"Something went wrong! "})
	}
	

}