var User = require('./user.model');

module.exports.getUser = function (req, res) {
	console.log("req.params>>>>>>>>>>>>>>>>  ",req.params.id)
	User.findOne({_id:req.params.id}, function(err, data){
		console.log("finally here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data)
		if (!data){
			res.json({"message":"User not found"})
			return

		}
		res.json({"data":data, message:"Success"})
	})
	
}
