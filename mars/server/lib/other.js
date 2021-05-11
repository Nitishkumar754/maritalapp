var convert = require('convert-units')
const Secrets = require('./../config/environment/secrets');

let methods = {

	generateOTP(length) {
    
	    var digits = '0123456789';
	    let OTP = '';
	    for (let i = 0; i < length; i++ ) {
	        OTP += digits[Math.floor(Math.random() * 10)];
	    }
	    return OTP;
	},

	feetToCm(heightinFeet){
	let [feet, inch] = heightinFeet.split(/'/);
	inch = parseInt(inch);
	feet = parseInt(feet);
	let totalHeightInFeet = feet+parseFloat(inch/12);
	let heightInCm = convert(totalHeightInFeet).from('ft').to('cm').toFixed(0);
	return heightInCm;
	},



	async uploadFileToAWS(uploadParams){
		const AWS = require('aws-sdk');
		const fs = require('fs');
		const path = require('path');

		  result = {};

		  AWS.config.update({
		    accessKeyId: Secrets.aws.accessKeyId,
		    secretAccessKey: Secrets.aws.secretAccessKey,
		    region: Secrets.aws.region
		  });
		  uploadParams.objectName ? uploadParams.objectName : 'report-' + moment().valueOf();

		  const S3 = new AWS.S3();
		  let params = {
		    ACL: uploadParams.ACL ? uploadParams.ACL : 'public-read',
		    Body: uploadParams.content,
		    Bucket: uploadParams.bucketName,
		    ContentType: uploadParams.contentType,
		    Key: uploadParams.objectName
		  };

		  try {
		    const stored = await S3.upload(params).promise();
		    result['status'] = 'success';
		    result['path'] = stored.Location;
		  } catch (err) {
		    result['status'] = 'failure';
		    result['error'] = err;
		  }
		  console.log("result", result);
		  return result;
		}
}

module.exports = methods;