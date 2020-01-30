var Razorpay = require('razorpay');

var rz_key = "rzp_test_0TDe2Q1HQmkcZ2";
var rz_secret = "VYsPY7U9YSyb5sTECnoj7lJo";


var razorpay = new Razorpay({
  key_id: rz_key,
  key_secret: rz_secret
})



module.exports = {
	
	razorpay_create_order:function(amount, currency, receipt, payment_capture, notes){
		amount = amount*100;
		return razorpay.orders.create({amount, currency, receipt, payment_capture, notes})
	
	},

	razorpay_get_by_payment_id:function(payment_id){
		return razorpay.payments.fetch(payment_id)
	},


	razorpay_get_payments_of_an_order:function(order_id){
		return razorpay.orders.fetchPayments(order_id)	
	}

}