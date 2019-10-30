
var Profile = require('./model')

module.exports.getAll = function(req, res){
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



