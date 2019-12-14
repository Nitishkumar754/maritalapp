module.exports = {

	map_subscription_data: function(subscription){
		console.log("subscription>>>>>>>>>>>> ", subscription);
		return{
			"subscription_type":subscription.type,
			"description":subscription.description,
			"duration":subscription.duration,
			"price":subscription.price,
			"created_at":subscription.created_at,
			"updated_at":subscription.updated_at,
			"contacts_allowed":subscription.contacts_allowed
		}

	}
}