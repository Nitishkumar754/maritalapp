const https = require('https');
/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./checksum');

/* initialize an object */
var paytmParams = {};

/* Find Sub Wallet GUID in your Paytm Dashboard at https://dashboard.paytm.com */
paytmParams["subwalletGuid"] = "SUBWALLET_GUID_HERE";

/* Enter your unique order id, this should be unique for every disbursal */
paytmParams["orderId"] = "123resrd13c";

/* Enter Beneficiary Phone Number against which the disbursal needs to be made */
paytmParams["beneficiaryPhoneNo"] = "9020912410";

/* Amount in INR payable to beneficiary */
paytmParams["amount"] = "1";

/* prepare JSON string for request */
var post_data = JSON.stringify(paytmParams);

/**
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
checksum_lib.genchecksumbystring(post_data, "YOUR_KEY_HERE", function(err, checksum){

	/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
	var x_mid = "YOUR_MID_HERE";

	/* put generated checksum value here */
	var x_checksum = checksum;

	var options = {

		/* for Staging */
		hostname: 'staging-dashboard.paytm.com',

		/* for Production */
		// hostname: 'dashboard.paytm.com',

		/* Solutions offered are: food, gift, gratification, loyalty, allowance, communication */
		path: '/bpay/api/v1/disburse/order/wallet/{solution}',
		port: 443,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-mid': x_mid,
			'x-checksum': x_checksum,
			'Content-Length': post_data.length
		}
	};

	// Set up the request
	var response = "";
	var post_req = https.request(options, function(post_res) {
		post_res.on('data', function (chunk) {
			response += chunk;
		});

		post_res.on('end', function(){
			console.log('Response: ', response);
		});
	});

	// post the data
	post_req.write(post_data);
	post_req.end();
});