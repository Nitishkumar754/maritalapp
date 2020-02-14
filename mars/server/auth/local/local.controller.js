'use strict';

var http = require('http');
var request = require('request')
var User = require('../../api/user/user.model').User;
var jwt = require('jsonwebtoken');
var User_OTP = require('../../api/user/user.model').User_OTP;
var User_Login_Session = require('../../api/user_login_session/user_login_session.model');
// var User_Ip_Token = require('../../api/user_ip_token/user_ip_token.model');
var auth_service = require('../auth.service');

// var {
//   sendSms , sendTransactionalSms
// } = require('../../lib/sms');

// var Otp_Controller = require('../../api/user_otp/user_otp.controller');
// var UserSubscription = require('../../api/user_subscription/user_subscription.model');
// var map = require('../../api/user_subscription/user_subscription.map.data.js');


// function respondWithResult(res, statusCode) {
//   statusCode = statusCode || 200;
//   return function(entity) {
//     console.log(entity)
//     if (entity) {
//       res.status(statusCode).json(entity);
//     }
//   };
// }

// function handleEntityNotFound(res) {
//   return function(entity) {
//     if (!entity) {
//       res.status(404).end();
//       return null;
//     }
//     return entity;
//   };
// }

// function handleError(res, statusCode) {
//   statusCode = statusCode || 500;
//   return function(err) {
//     res.status(statusCode).send(err);
//   };
// }

// export function generateOTP(req, res) {

//   if (!req.params || !req.params.mobile_number) {

//     res.send(500, "mobile number is missing!");

//   } else {

//     var otp = generateUUID();
//     var userPromise = getUser(req.params.mobile_number);

//     userPromise.then(function(user) {
//       var deleteTokenPromise = deleteAllOtp(user._id);

//       deleteTokenPromise.then(function() {

//           sendTransactionalSms(req.params.mobile_number, otp)

//           .then(function(sms) {

//             var user_otp = {
//               otp: otp,
//               id: user._id
//             };

//             Otp_Controller.create(user_otp)

//             .then(function(response) {
             
//               res.send(200, response);
//             })

//             .catch(function(error) {
//               console.log("error create", error);
//             })


//           })
//         })
//         .catch(function(error) {
//           Otp_Controller.create(user_otp)

//           .then(function(response) {

//             res.send(200, response);
//           })

//           .catch(function(error) {
//             console.log("error create", error);
//           })

//         })
//         .catch(function(error) {

//           res.send(500, "Error sending sms");
//         })
//     });
//   }
// }



// export function checkRegisteredUser(req, res) {

//   if (!req.params || !req.params.mobile_number) {

//     res.send(500, "mobile number is not present");
//   } else {

//     User.find({
//         mobile_number: req.params.mobile_number
//       })
//       .then(function(respose) {
//         if (respose && respose.length > 0) {
//           res.status(200).send("success");
//         } else {
//           res.send(500, "Not Registered");
//         }
//       })

//     .catch(function(error) {
//       res.send(500, error);
//     });

//   }
// }

// export function login(req, res) {
  
//   if (!req.body && !req.body.user) {
//     res.send(500, "user body is not present")
//   }

//   var user = req.body.user;
//   var userPromise = getUser(user.mobile_number);
//   userPromise.then(function(userResponse) {
//     if(userResponse === null){
//       res.send(500, "User is not registered!!..!!");
//       return;
//     }

   
//     var subscriptions = getSubscriptions(userResponse);
//     subscriptions.then(function(details) {
//       if (details && (details.currentSubscriptions.length==0 && details.expiredSubscriptions.length==0) ) {
//         res.status(401).send("Please purchase or try any subscription and come back here.");
//       } else {
//         var token = signToken(userResponse._id, userResponse.role, details.activeList);

//         var user_login_session = {
//           token: token,
//           user: userResponse._id,
//           role: userResponse.role,
//           subscriptions: details
//         }

//         deleteAllOtp(userResponse._id);
//         var userOtpPromise = getToken(userResponse._id, user.otp);
//         var userSession = deleteUserSession(userResponse._id);

//         userOtpPromise.then(function(otpResponse) {
//           if (!otpResponse) {
//             res.send(500, "OTP do not match");
//           }
//           userSession.then(function(deleteUserSession) {

//             User_Login_Session.create(user_login_session)
//               .then(function(userSession) {
//                 var result = {
//                   token: userSession.token,
//                   subscriptions: details
//                 }
//                 otpResponse.active = false;
//                 otpResponse.save()
//                 .then(function(otpUpdate) {
//                   res.send(200, result);
//                 })
//                 .catch(function(error) {
//                   res.send(500, "Error in updating user otp");
//                 });

//               })

//             .catch(function(error) {
//               console.log("-----------------------", error);
//               res.send(500, "Error in creating user session");

//             });
//           })

//           .catch(function(error) {
//             res.send(500, "error in deleting session");
//           })
//         })
//       }

//     })
//   })

//   .catch(function(error) {
//     console.log(error,"============");
//     res.send(500, "User is not registered");
//   });

// }

// router.post('/login', function(req, res){
//   console.log("login api called>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.headers)
//    console.log("login api called>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.body)
//    if(!req.body.username){
//       res.send({status:false, message:"Invalid credentials"});
//    } else {
       
//       getUser(req.body.username)
//       .then(function(user){
//         console.log("user**************** ", user);
//         if(user.email==req.body.username){

          
//           const payload = {
//         user_id: user._id,
//         username: user.email
//       };
//       var token = jwt.sign(payload, "this is super secret", {expiresIn: '10h'})
//       user.token = token
//       req.session.user = user
//       console.log("payload>>>>>>>>>>>>>>>>>>>>> ",payload)
//       res.json({
//         status:true,
//         token:token
//       })
//         }
//         else{
//         res.json({
//         status:false,
//         "message":"Login failed"
//       })
//         }

//       })
//       .catch(function(err){
//         console.log("err>>>>>>>>>>>>>>> ", err)
//         res.redirect('/login')
//       })
//    }
// });



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



// module.exports.login =  function(req, res){

//    console.log("login api called 2>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.body)
//    if(!req.body.username){
//       res.send({status:false, message:"Invalid credentials"});
//    } else {
       
//       getUser(req.body.username)
//       .then(function(user){
//         console.log("user**************** ", user);
//         if(user.email==req.body.username){

//        var token = auth_service.signToken(user._id, user.role);

//         var user_login_session = {
//           token: token,
//           user: user._id,
//           role: user.role
//         }

//         deleteAllOtp(user._id);
//         var userSession = deleteUserSession(user._id);

//       // var token = jwt.sign(payload, "this is super secret", {expiresIn: '10h'})
     
//       console.log("token>>>>>>>>>>>>>>>>> ",token);
//       userSession.then(function(deleteUserSession) {

//             User_Login_Session.create(user_login_session)
//               .then(function(userSession) {
//                 console.log("userSession>>>>>>>>>>>>>>> ",userSession);
//                 var result = {
//                   token: userSession.token,
//                   status:true
//                 }
                
//                   res.send(200, result);

//               })

//             .catch(function(error) {
//               console.log("-----------------------", error);
//               res.send(500, "Error in creating user session");

//             });
//           })

//           .catch(function(error) {
//             res.send(500, "error in deleting session");
//           })
//         }
//         else{
//         res.json({
//         status:false,
//         "message":"Login failed"
//       })
//         }

//       })
//       .catch(function(err){
//         console.log("err>>>>>>>>>>>>>>> ", err)
//         res.redirect('/login')
//       })
//    }

// }

module.exports.login =  async function(req, res){

   console.log("login api called 2>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.body)
   if(!req.body.username || ! req.body.password){
      res.send({status:false, message:"Invalid credentials"});

   } else {
      
     try{
       const user = await User.findByCredentials(req.body.username, req.body.password);
       console.log("user llallll", user);
       const token = await user.generateAuthToken()
       console.log("token>>>>>>>>>>>>>>>>>>>>> ",token);

       var user_login_session = {
          token: token,
          user: user._id,
          role: user.role
        }

       deleteAllOtp(user._id);
       const deletedSession = await deleteUserSession(user._id);
       const userSession = await User_Login_Session.create(user_login_session);

       var result = {
                  token: userSession.token,
                  status:true
                }
        
         res.send(200, result);
       // userSession.then(function(deleteUserSession) {

       //      User_Login_Session.create(user_login_session)
       //        .then(function(userSession) {
       //          console.log("userSession>>>>>>>>>>>>>>> ",userSession);
                
                
       //            res.send(200, result);

       //        })

       //      .catch(function(error) {
       //        console.log("-----------------------", error);
       //        res.send(500, "Error in creating user session");

       //      });
       //    })

          // .catch(function(error) {
          //   res.send(500, "error in deleting session");
          // })

     }
      
     catch (e){
       console.log("e>>>>>>>>>>>> ",e);
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