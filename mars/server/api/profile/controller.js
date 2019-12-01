
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
     	console.log("file>>>>>>>>>>>>>>>>>>>>>>> ", file)
         callback(null, "./uploads/images");
     },
     filename: function(req, file, callback) {
     	var file_name = file.fieldname + "_" + Date.now() + "_" + file.originalname;
     	console.log("file_name>>>>>>>>>>>>>> ", file_name);
         // callback(file_name, file_name);
         callback(null, file_name);
     }
 });


var upload = multer({
     storage: Storage
 }).single('file0'); //Field name and max count



module.exports.image_upload = function(req, res){
	
	console.log("req.user>>>>>>>>>>>>>> ", req.user, ">>>>>>>>>>>>>>>>>>>>>");
	upload(req, res, function(err) {
		console.log('err>>>>>>>>>> ', err);

		console.log("req.file>>>>>>>>>> ", req.file);
		// console.log("re-file-name>>>>>>>>>>>> ", )
         Profile.updateOne({user:req.user.id}, {$push: {profile_images: req.file.filename} })
		.then(function(data){
			console.log("data>>>>>>>>>>>>>>>>> ",data);
			res.status(200).json({"status":true, "message":"success"})
		
		})
});
	
}
