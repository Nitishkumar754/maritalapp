var Razorpay = require('razorpay');

var rz_key = "rzp_test_0TDe2Q1HQmkcZ2";
var rz_secret = "VYsPY7U9YSyb5sTECnoj7lJo";


var razorpay = new Razorpay({
  key_id: rz_key,
  key_secret: rz_secret
})



module.exports = {
	
	razorpay_create_order:function(amount, currency, receipt, payment_capture, notes){

	return razorpay.orders.create({amount, currency, receipt, payment_capture, notes})
	  // .then(function(data){
	  //   console.log("razorpay_response data",data);
	  //   // res.status(200).json(data);
	  //   return data;
	  // })
	  // .catch(function(err){
	  //   console.log("razorpay err>>>>>>>>>>> ",err);
	  //    // res.status(500).json({"error":err});

	  // })
	
	}
}