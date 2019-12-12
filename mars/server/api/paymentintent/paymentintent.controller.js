var Paymentintent = require('./paymentintent.model');

module.exports.create_payment_intent = function(req, res){
	var request_body = req.body
	var susbscription_id  = request_body.susbscription_id
	if(!susbscription_id){
		res.status(400).json({"message":"No subscription found!!"})
	}

	var paymentintent = new Paymentintent({
			user:user,
			susbscription:request_body.susbscription_id
		})
		new_subs.save()
		.then(function(data){
			res.json({ "message":"Susbcription created "})
	})
	
}


// export function createPaymentOrder(req, res){
//   console.log("req.body>>>>>>>>>>>>>>>>>>>>>> ",req.body);
//   var amount=100;
//   var currency='INR';
//   var payment_capture=1;
//   var receipt=req.body.txnid;
//   var notes='';
//   razorpay.orders.create({amount, currency, receipt, payment_capture, notes})
//   .then(function(data){
//     console.log("razorpay_response data",data);
//     res.status(200).json(data);
//   })
//   .catch(function(err){
//     console.log("razorpay err>>>>>>>>>>> ",err);
//      res.status(500).json({"error":err});

//   })

 
// }