module.exports = {

	map_subscription_data: function(subscription){
		console.log("subscription>>>>>>>>>>>> ", subscription);
		return{
			"type":subscription.type,
			"description":subscription.description,
			"duration":subscription.duration,
			"price":subscription.price,
			"created_at":subscription.created_at,
			"updated_at":subscription.updated_at,
			"contacts_allowed":subscription.contacts_allowed
		}

	},

	generate_search_query:function(search_body){
		console.log("search_body haha>>>>>>>>>>>>>>>>>>>> ",search_body);
		var search_query = {
			user_query:{},
			payment_query:{}
		}
		if (search_body.mobile_number){
			search_query['user_query']['mobile_number'] = search_body.mobile_number;
		}
		if(search_query.status){
			search_query['user_query']['status'] = search_body.status;
		}
		if (search.status == 'success'){
			
		}

		console.log("search_query>>>>>>>>>>>>>>>> ",search_query);
		return search_query;
	}
}