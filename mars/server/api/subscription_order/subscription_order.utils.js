var SubscriptionOrder = require('./subscription_order.model');
var moment = require('moment');

module.exports = {
	
	get_user_subscription:function(id){
		console.log("id>>>>>>>>>>>>>> ", id);
	return SubscriptionOrder.findOne({user:id})
	.then(function(subscription_order){
		// console.log("subscription_order>>>>>>>>>> ",subscription_order);
		return new Promise(function (resolve, reject) {
		    if(!subscription_order || subscription_order.status!= 'success'){
		    	return reject(null);	
		    }
		    var is_expired = get_subscription_order_expiry_date(subscription_order)
		    if(is_expired){
		    	return reject(null);
		    }
		    return resolve(true)

		})
	
	
	})
	}
}


function get_subscription_order_expiry_date(subscription_order){

var dt_created = subscription_order.created_at;
var duration = subscription_order.subscription.duration;
var expiry_date = moment(dt_created, "DD-MM-YYYY").add(duration, 'days');
var current_date = moment();
return current_date > expiry_date;

}