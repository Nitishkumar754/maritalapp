
var User_OTP = require('./user.model').User_OTP;
var mailer = require('../../lib/mail');
var oauth_mailer = require('../../lib/oauth2_mail');
var config = require("../../config/environment");
const EMAIL_SECRET = 'email-verifications-secret';
const jwt  = require('jsonwebtoken');
const ejs = require('ejs');


function get_registration_link_html(name,email_url){
  var html = `<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
<style>
body {
  background-color: #fff;
  padding-left:20px;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
</head>
<body>
<p>Hi ${name},</p>
<p>Thank you for registration</p>
<p>Please click on this link to verify your email at shaadikarlo.in</p>
<p>${email_url}</p>


Thanks <br>
<span style= 'padding-bottom:10px;'>Team Shaadikarlo<span>

</body>
</html>
`
return html;
}



module.exports = {
	
	sendOtp:function(userDetails,email_url){
		if (userDetails) {
    var otp, msg, user_otp, reply;
    otp = generateUUID();
    msg = "Enter " + otp + " as your verification code to register to shaadikarlo account. "
    user_otp = {
      otp: otp,
      id: userDetails.id
    };

    var deleteTokenPromise = deleteAllOtp(userDetails.id);
    return deleteTokenPromise.then(function() {
    	var html= get_registration_link_html(name=userDetails.name, email_url);
    	var list = [];
        return oauth_mailer.triggerMail(to='nitishkumar1500@gmail.com', subject="Email Verification Link", text="registration text", html=html)
          .then(function(otp) {
          	
            return create_otp(user_otp)
              .then(function(response) {
                return reply = {
                  email: userDetails.email,
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
	},

  get_user_update_body:function(request_body){
    data = request_body.user;
    address = data.address
    var user_update_body = {};

    user_update_body = {
      email:data.email,
      name:data.name,
      address:{addressline1:address.addressline1, addressline2:address.addressline2, city:address.city, state:address.state, pincode:address.pincode}
    }
    return user_update_body;
  },


  get_profile_update_body: function(request_body){
    console.log("request_body>>>>>>>>>>>>>> ", request_body);
    data = request_body;
    var profile_update_body = {};
    profile_update_body = {
      annual_income:data.annual_income,
      complexion:data.complexion,
      blood_group:data.blood_group,
      body_type:data.body_type,
      cast:data.cast,
      education:data.education,
      height:data.height,
      father_occupation:data.father_occupation,
      mother_occupation:data.mother_occupation,
      // dob:data.dob,
      diet:data.diet,
      drink:data.drink,
      occupation: data.occupation,
      marital_status:data.marital_status,
      mother_tongue:data.mother_tongue,
      no_of_brothers:data.no_of_brothers,
      no_of_sisters:data.no_of_sisters,
      religion:data.religion,
      cast:data.cast,
      smoke:data.smoke,
      weight:data.weight

    }

    return profile_update_body
  },

  validate_request_body:function(request_body){
    request_keys = Object.keys(request_body);
    console.log("request_body>>>>>>>>>>>>>> ",request_body.gender);
    if(!request_body){
      return[false, "Bad request"];
    }
    if(!request_keys.includes('email')){
      return [false, "Email is missing"];
    }
    if(!request_keys.includes('mobile_number')){
      return [false, "mobile_number is missing"];
    }

    if(!request_keys.includes('gender')){
      return [false, "gender is missing"];
    }

    if(!request_keys.includes('password')){
      return [false, "password is missing"];
    }

    if(!request_keys.includes('dob')){
      return [false, "date of birth is missing"];
    }

    // if((request_body.gender != 'm' ) || (request_body.gender != 'f' )){
    //   return [false, 'invalid gender provided']
    // }
  
    return [true, ""]
  },

  send_email_verification_url: async function(userDetails, req){

    const email_url = get_email_verification_url(userDetails.id, req);
    // var html= get_registration_link_html(name=userDetails.name, email_url);

    var otp_obj = {name:userDetails.name,  email_url:email_url};
      ejs.renderFile(__dirname+'/../../email_templates/email_otp.ejs', {data:otp_obj}, async (err, data) => {
      
      if (err) {
          throw err;
      } else {

        console.log("html **** ",data);

        let html = data;


          try{
              const email_resp = await oauth_mailer.triggerMail(to=userDetails['email'], subject="Email Verification Link", text="registration text", html=html)
              console.log("email_resp>>>>> ",email_resp);
          }
          catch(e){
              console.log("e>>>>>>>>>>>>>>> ",e);
          }

      }

      });

   
  },

   send_email_verification_otp: async function(userDetails, req, email_otp){

    var otp_obj = {name:userDetails.name,  email_otp:email_otp};
      ejs.renderFile(__dirname+'/../../email_templates/email_otp.ejs', {data:otp_obj}, async (err, data) => {
      
      if (err) {
          throw err;
      } else {

        console.log("html **** ",data);

        let html = data;


          try{
              const email_resp = await oauth_mailer.triggerMail(to=userDetails['email'], subject="Email Verification OTP", text="registration text", html=html)
              console.log("email_resp>>>>> ",email_resp);
          }
          catch(e){
              console.log("e>>>>>>>>>>>>>>> ",e);
          }

      }

      });

   
  }


}


function deleteAllOtp(id) {
  return User_OTP.deleteMany({
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

console.log("global.gConfig>>>> ",global.gConfig);

function get_email_verification_url(id, req){
  // console.log("req>>>>>>>>>> ", req.get('origin'));
  const email_token = jwt.sign({_id:id.toString()}, EMAIL_SECRET, {expiresIn: '3d'});
  let email_verification_url='';

  email_verification_url = `${global.gConfig.url}/api/user/email/confirmation/${email_token}`;
  
  return email_verification_url;
}

