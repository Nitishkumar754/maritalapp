var SubscriptionOrder = require('./subscription_order.model');
var moment = require('moment');

module.exports = {
	
	get_user_subscription:function(id){
		console.log("id>>>>>>>>>>>>>> ", id);
	return SubscriptionOrder.find({
		user:id, 
		contacts_available :{$gt:0},
		status:'success',
		$where: function() {
                var dt_created = new Date(this.created_at); //2march
                var current_date = new Date(); //15march

                var expiry_date = new Date(new Date(dt_created).setDate(dt_created.getDate() + parseInt(this.subscription.duration)));
                //2march+10days = 12march
				return current_date < expiry_date;
               
        }
	})

	.sort({'created_at':1})
	.then(function(subscription_order){
		
		return new Promise(function (resolve, reject) {
		    if(!subscription_order[0]){
		    	return reject({"subscription":false});	
		    }
		    // var is_expired = get_subscription_order_expiry_date(subscription_order)
		    // if(is_expired){
		    // 	return reject({"expired":true});
		    // }
		    return resolve(subscription_order[0])

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