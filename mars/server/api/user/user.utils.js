
var User_OTP = require('./user.model').User_OTP;
var mailer = require('../../lib/mail');
var config = require("../../config/environment")


module.exports = {
	
	sendOtp:function(userDetails){
		if (userDetails) {
    var otp, msg, user_otp, reply;
    otp = generateUUID();
   	console.log("otp>>>>>>>>>>>>>>>>> ",otp);
    msg = "Enter " + otp + " as your verification code to register to marital account. "
    user_otp = {
      otp: otp,
      id: userDetails.id
    };

    var deleteTokenPromise = deleteAllOtp(userDetails.id);
    return deleteTokenPromise.then(function() {
    	var html= '<h3>Your OTP to confirm registration is '+ otp+ '</h3>';
    	var list = [];
        return mailer.sendMail(config.mail.sender, 'nitish@fisdom.com', "Registration otp", null, html, list)
        
          .then(function(otp) {
          	
            return create_otp(user_otp)
              .then(function(response) {
                return reply = {
                  mobile_number: userDetails.mob,
                  otp: response.otp
                };
              })
              .catch(function(error) {
                console.log("Unable to save OTP");
              })
          })
          .catch(function(error) {
            // res.status(500).send("Unable to send OTP");
            return create_otp(user_otp)
              .then(function(response) {
                return reply = {
                  mobile_number: userDetails.mob,
                  otp: response.otp
                };
              })
              .catch(function(error) {
                console.log("Unable to save OTP");
              })
          })
      })
      .catch(function(error) {
      	console.log("error>>>>>>>>>>> ",error);
        console.log("Unable to clear old OTP");
      })
  } else {
    console.log("Unable to find number to send OTP");
  }
	}

}


function deleteAllOtp(id) {
  return User_OTP.remove({
    user: id
  });
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}


function create_otp(user){
	var user_otp = formObject(user);
  return User_OTP.create(user_otp);

}


function formObject(user){
  var user_otp = {
    user:user.id,
    active:true,
    otp:user.otp
  }
  return user_otp;
}