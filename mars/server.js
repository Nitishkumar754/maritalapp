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

var cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

require("console-stamp")(console, "[HH:MM:ss.l]");

const express = require("express");
const app = express();

// app.use(cors({origin: ['http://localhost:4200', 'http://localhost:4000']}));

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:4200",
      "http://localhost:9000",
      "http://shaadikarlo.in:9001",
      "http://localhost:5000",
      "http://localhost:4000",
      "http://shaadikarlo.in/",
      "https://shaadikarlo.in/",
    ],
  })
);
// var multer = require('multer');
const session = require("express-session");
const bodyParser = require("body-parser");

var passport = require("passport");
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const connect = require("./connect");
const path = require("path");
app.use(
  session({
    secret: "qwerty",
    proxy: true,
    resave: false,
    SaveUninitialized: true,
    maxAge: 1,
    cookie: { secure: false, maxAge: 10000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/callback", function (req, res) {
  console.log("req.body>>>>>>> ", req.body);
  res.status(200).send({ message: "success" });
});

var auth_fb = require("./server/auth/passport_facebook_auth");
var auth = require("./server/auth/passport_jwt_auth");
var auth = require("./server/auth");
// app.use('/', auth_fb) //for
app.use("/auth", auth);

app.use(express.static(path.join(__dirname, "../dist/shaadikarlo")));

//RELATED TO ENVIRONEMNT CONFIG
const config = require("./config");
const _ = require("lodash");
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

global.gConfig = finalConfig;

console.log("global.gConfig ", global.gConfig);

app.use("/api", require("./server/routes"));
// app.use(express.static('public'))
app.use(express.static("uploads"));

function getRoot(request, response) {
  if (global.gConfig.config_id == "development") {
    response.sendFile(path.resolve("../dist/shaadikarlo/index.html"));
  } else {
    response.sendFile(path.resolve("./dist/shaadikarlo/index.html"));
  }
}

function getUndefined(request, response) {
  if (global.gConfig.config_id == "development") {
    response.sendFile(path.resolve("../dist/shaadikarlo/index.html"));
  } else {
    response.sendFile(path.resolve("./dist/shaadikarlo/index.html"));
  }
}

app.get("/", getRoot);
app.get("/*", getUndefined);

// app.get('*', (req, res) => {
// 	console.log("req.url>>>>>>>>>>>>>>> ",req.url);

//   res.sendFile(path.join(__dirname, '../dist/u/index.html'));
// });

app.use("/loginerror", function (req, res) {
  res.json({ status: false, data: "data", message: "Login error" });
});
const port = process.env.SERVER_PORT || 4000;
const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});

// var seed = require('./server/config/seed');
// console.log("seed>>>>>>>>>>>>>>>>>>> ", seed)
// 	seed.seedDatabase().then(function() {
// 		console.log("seeding completed!");
// 		// startServer();
// 	})
