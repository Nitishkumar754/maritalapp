
var Profile = require('./model');
var multer = require('multer');


module.exports.getAll = function(req, res){
	console.log("get_all >>>>>>>>>>>>>>>>> ",req.user);
	Profile.find({gender:'F'})
	.limit(5)
	.then(function(profiles){
		if(!profiles){
			res.json({"data":[], "message":"No record found"})
		}
		res.json({"data":profiles, "message":"Success"})
	})
}
//ObjectId("5ccddd6246a4012e219073b2")
module.exports.getProfile = function(req, res){
	console.log("getProfile >>>>>>>>>>>>>>>>> ",req.user);
	console.log("req1>>>>>>>>>>>>>>>> ", req.body)
	console.log("req2>>>>>>>>>>>>>>>> ", req.query)
	console.log("req3>>>>>>>>>>>>>>>> ", req.params)
	Profile.findOne({user_id:req.params.id}).then(function(profile){
		console.log("profile>?????????????????? ", profile)
		if(!profile){
			res.json({"data":[], "message":"Profile not available"})
			return
		}
		res.json({"data":profile})
	})
}


var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./Images");
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
 });


var upload = multer({
     storage: Storage
 }).array("imgUploader", 3); //Field name and max count



module.exports.image_upload = function(req, res){
	console.log("getProfile >>>>>>>>>>>>>>>>> ",req.user);
	console.log("req1>>>>>>>>>>>>>>>> ", req.body)
	console.log("req2>>>>>>>>>>>>>>>> ", req.query)
	console.log("req3>>>>>>>>>>>>>>>> ", req.params)

	console.log("req.file>>>>>>>>>>>>>>>> ", req.file)

	upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");
     });
	res.status(200).json({"status":true, "message":"success"})
	// Profile.findOne({user_id:req.params.id}).then(function(profile){
	// 	console.log("profile>?????????????????? ", profile)
	// 	if(!profile){
	// 		res.json({"data":[], "message":"Profile not available"})
	// 		return
	// 	}
	// 	res.json({"data":profile})
	// })
}


