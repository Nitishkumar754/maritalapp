let Constant = require('../../lib/constant');

module.exports.getAllMapper = async(req, res)=>{
	let education = Constant.education;
	let occupation = Constant.occupation;
	let caste_list = Constant.caste_list;
	let religion_list = Constant.religion_list;
	return res.status(200).send({"message":"Success", education, occupation, caste_list, religion_list});

}