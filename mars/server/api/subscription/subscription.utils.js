var Subscription = require('./subscription.model');

module.exports = {
	
	get_subscription_by_id:function(id){

	return Subscription.findOne({_id:id})
	
	}
}