'use strict';

var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model').User;
// var UserLoginSession = require('../api/user_login_session/user_login_session.model');
var Q = require('q');

var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 
 */

// var isValidSession = function(token) {
//   var deferred = Q.defer();
//   UserLoginSession.findOne({
//       token: token
//     })
//     .then(function(userSession) {
//       if (userSession === null) {
//         deferred.reject(false);
//       } else
//         deferred.resolve(true);
//     })

//   return deferred.promise;
// }



 
module.exports.isAuthenticated =  function() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {

      User.findById(req.user._id)
        .then(user => {
          console.log("user>>>>>>>>>>>>>>>>", user );
          if (!user) {
            return res.status(401).end();
          }
          req.user = user;
          next();
        })
        .catch(err => next(err));
    });
}

// /**
//  * Checks if the user role meets the minimum requirements of the route
//  */
// module.exports.hasRole =  function(roleRequired) {
//   if (!roleRequired) {
//     throw new Error('Required role needs to be set');
//   }

//   return compose()
//     .use(isAuthenticated())
//     .use(function meetsRequirements(req, res, next) {
//       if (config.userRoles.indexOf(req.user.role) >=
//         config.userRoles.indexOf(roleRequired)) {
//         next();
//       } else {
//         res.status(403).send('Forbidden');
//       }
//     });
// }
/*
 * Check is admin by token sent in url
 */
// module.exports.isValidAdminToken = function() {
//   return compose()
//     .use(function(req, res, next) {
//       req.headers.authorization = 'Bearer ' + req.params.token;
//       validateJwt(req, res, next);
//     })

//   .use(function meetsRequirements(req, res, next) {

//     if (config.userRoles.indexOf(req.user.role) >=
//       config.userRoles.indexOf('admin')) {
//       next();
//     } else {
//       res.status(403).send('Forbidden');
//     }
//   })

// }
// /**
//  * Returns a jwt token signed by the app secret
//  */
module.exports.signToken = function(id, role) {
  return jwt.sign({
    _id: id,
    role: role
  }, config.secrets.session, {
    expiresIn: 60 * 60 * 10
  });
}

// /**
//  * Set token cookie directly for oAuth strategies
//  */
// module.exports.setTokenCookie = function (req, res) {
//   if (!req.user) {
//     return res.status(404).send('It looks like you aren\'t logged in, please try again.');
//   }
//   var token = signToken(req.user._id, req.user.role);
//   res.cookie('token', token);
//   res.redirect('/');
// }


// /**
//  * Returns a jwt token signed by the app secret
//  */
// module.exports.signIpToken = function(ip) {
//   return jwt.sign({
//     ipAddress: ip
//   }, config.secrets.session, {
//     expiresIn: 60 * 60 * 10
//   });
// }

/**
 * Attaches the user object to the request if authenticated for case search
 * Otherwise returns 403
 */