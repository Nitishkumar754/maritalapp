// const express = require('express');
// const app = express();
// const session = require('express-session')
// const bodyParser = require('body-parser');
// var flash = require('connect-flash');
// var passport = require('passport');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const connect = require('./connect')

// app.use(session({secret:'qwerty',proxy: true, resave:false, SaveUninitialized:true, maxAge:1,cookie: { secure:false, maxAge:10000}}))
// // app.use(session({secret:'qwerty'}))
// app.use(passport.initialize());
// app.use(passport.session());
// // var auth = require('./auth/jwt_auth')
// // var auth2  = require('./auth/passport_jwt_auth')
// var auth3 = require('./auth/passport_local_auth')
// // app.use('/', auth)
// app.use(flash());
// app.use('/', auth3)
// app.use('/user', function(req, res){
// 	res.send("cool")
// })
// const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
// const server = app.listen(port, function () {
//     console.log('Server listening on port ' + port);
// });
// mongoose.connect('mongodb://localhost/myappdatabase');

var cors = require('cors')

const express = require('express');
const app = express();
app.use(cors())
app.use(cors({origin: 'http://localhost:4200'}));

const session = require('express-session')
const bodyParser = require('body-parser');

var passport = require('passport');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connect = require('./connect')

app.use(session({secret:'qwerty',proxy: true, resave:false, SaveUninitialized:true, maxAge:1,cookie: { secure:false, maxAge:10000}}))

app.use(passport.initialize());
app.use(passport.session());

var auth_fb = require('./server/auth/passport_facebook_auth')
var auth = require('./server/auth/passport_jwt_auth')
var auth = require('./server/auth');
// app.use('/', auth_fb) //for 
app.use('/auth', auth);

app.use('/api', require('./server/routes'))
app.use(express.static('public'))

// app.use('/users/:id', function(req,res){
// 	console.log("req.params>>>>>>>>>>>>>>>>>>>>> ",req.params)


// 	res.json({status:true, data:"data", message:"Login successful"})
// })

// function interceptor(auth_fb){
// 	console.log("collllllllllllllllllll>>>>>>>>>>>>> ");
// 	// next();
// 	auth_fb()
// }
app.use('/loginerror', function(req, res){
	
	res.json({status:false, data:"data", message:"Login error"})
})
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

var seed = require('./server/config/seed');
console.log("seed>>>>>>>>>>>>>>>>>>> ", seed)
	seed.seedDatabase().then(function() {
		log("seeding completed!");
		// startServer();
	})


