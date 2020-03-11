'use strict';

var http = require('http');
var request = require('request')
var User = require('../../api/user/user.model').User;
var jwt = require('jsonwebtoken');
var User_OTP = require('../../api/user/user.model').User_OTP;
var User_Login_Session = require('../../api/user_login_session/user_login_session.model');
// var User_Ip_Token = require('../../api/user_ip_token/user_ip_token.model');
var auth_service = require('../auth.service');


function getUser(username){
  console.log("username>>>>>>>>>>>>>>> ",username);
  return new Promise(function(resolve, reject){
  User.findOne({email:username})
      .then(function(user){
        // console.log("users>>>>>>>>>>>>>>>>>>", user)
        resolve(user)
      })
      .catch(function(err){
         reject(err)
      })
  })
  
 }



module.exports.login =  async function(req, res){

   console.log("login api called 2>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.body)
   if(!req.body.username || ! req.body.password){
      res.send({status:false, message:"Invalid credentials"});

   } else {
      
     try{
       const user_obj = await User.findByCredentials(req.body.username, req.body.password);
       
       if(user_obj.status===false){
         
         res.status(400).json({"message":user_obj.message})
         return 
       }
       const token = await user_obj.generateAuthToken()
       console.log("token>>>>>>>>>>>>>>>>>>>>> ",token);

       var user_login_session = {
          token: token,
          user: user_obj._id,
          role: user_obj.role
        }

       deleteAllOtp(user_obj._id);
       const deletedSession = await deleteUserSession(user_obj._id);
       const userSession = await User_Login_Session.create(user_login_session);

       var result = {
                  token: userSession.token,
                  status:true
                }
        
         res.send(200, result);

     }
      
     catch (e){
       console.log("e>>>>>>>>>>>> ",e.status, e.message);

       res.status(500).send({"error":e})
     }
      
   }

}



module.exports.adminlogin =  async function(req, res){

   console.log("admin login api called ", req.body)
   if(!req.body.username || ! req.body.password){
      res.send({status:false, message:"Invalid credentials"});

   } else {
      
     try{
       const user_obj = await User.findByCredentials(req.body.username, req.body.password);
       
       if(user_obj.status===false){
        
         res.status(403).json({"message":"Forbidden"})
         return; 
       }
       if (user_obj.role =='user'){
         res.status(403).json({"message":"Forbidden"});
         return;
       }
       const token = await user_obj.generateAdminAuthToken()
       console.log("generatedToken>>>>>>>>>> ", token);
       var user_login_session = {
          token: token,
          user: user_obj._id,
          role: user_obj.role
        }

       const deletedSession = await deleteUserSession(user_obj._id);
       const userSession = await User_Login_Session.create(user_login_session);

       var result = {
                  token: userSession.token,
                  status:true
                }
        
         res.send(200, result);

     }
      
     catch (e){
       console.log("e>>>>>>>>>>>> ",e.status, e.message);

       res.status(500).send({"error":e})
     }
      
   }

}




// function generateUUID() {
//   var d = new Date().getTime();
//   var uuid = 'xxxxxx'.replace(/[xy]/g, function(c) {
//     var r = (d + Math.random() * 16) % 16 | 0;
//     d = Math.floor(d / 16);
//     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//   });
//   return uuid;
// }

// function getUser(mobile_number) {

//   return User.findOne({
//     mobile_number: mobile_number
//   });
// }

function deleteUserSession(id) {

  return User_Login_Session.remove({
    user: id
  });
}

// function getToken(id, otp) {
//   return User_OTP.findOne({
//     otp: otp,
//     user: id
//   });
// }

function deleteAllOtp(id) {
  return User_OTP.remove({
    user: id
  });
}

// function getSubscriptions(user) {
  
//   var query={
//       user: user,
//       'status':"Success"
//   };
//   return map.getSubscriptionList(query)
//     .then(function(user_subscriptions) {
//       if (user_subscriptions) {        
//         return user_subscriptions;
//       } else {
//         return {
//           currentSubscriptions: [],
//           expiredSubscriptions:[]
//         };
//       }
//     })
//     .catch(function(error) {
//       console.log(error);
//     });

// }


// // export function verifyGuestLogin(req, res) {
// //   if (!req.body && !req.body.user) {
// //     res.send(500, "user body is not present")
// //   }
// //   var user = req.body.user;
// //   var userPromise = getUser(user.mobile_number);

// //   userPromise.then(function(userResponse) {

// //       var token = signToken(userResponse._id, userResponse.role);

// //       var user_login_session = {
// //         token: token,
// //         user: userResponse._id,
// //         role: userResponse.role
// //       }
// //       var userOtpPromise = getToken(userResponse._id, user.otp);
// //       var userSession = deleteUserSession(userResponse._id);

// //       userOtpPromise.then(function(otpResponse) {
// //         if (!otpResponse) {
// //           res.send(500, "OTP do not match");
// //         }
// //         userSession.then(function(deleteUserSession) {

// //           User_Login_Session.create(user_login_session)
// //             .then(function(userSession) {

// //               var result = {
// //                 token: userSession.token,
// //                 currentSubscriptions: userSession.currentSubscriptions
// //               }

// //               res.send(200, result);
// //             })

// //           .catch(function(error) {
// //             res.send(500, "Error in creating user session");

// //           });
// //         })

// //         .catch(function(error) {
// //           res.send(500, "error in deleting session");
// //         })
// //       })
// //     })
// //     .catch(function(error) {
// //       res.send(500, "error in getting details");
// //     })
// // }

// function getOtpCount(id) {
//   return User_OTP.findOne({
//     user: id
//   });
// }

// function deleteActiveIpDetails(id) {
//   console.log("deleteAllOtp-->", id);
//   return User_OTP.remove({
//     user: id
//   });
// }