let Constant = require('../../lib/constant');

module.exports.getAllMapper = async(req, res)=>{
	let education = Constant.education;
	let occupation = Constant.occupation;
	let caste_list = Constant.caste_list;
	let religion_list = Constant.religion_list;

	return res.status(200).send({"message":"Success", education, occupation, caste_list, religion_list});

}

module.exports.getAllMapper2 = async(req, res)=>{
	let education = Constant.education;
	let occupation = Constant.occupation;
	let caste_list = Constant.caste_list;
	let religion_list = Constant.religion_list;
	let stateDistrictMapper = Constant.states;
	let stateList = [];
	let districtList = [];
	let gender = Constant.gender;
	let height = Constant.height;

	for (const [, state] of Object.entries(stateDistrictMapper)) {
  		stateList.push({key:state.state_code, value:state.state})
	}
	for (const [, state] of Object.entries(stateDistrictMapper)) {
  		for(const[, value] of Object.entries(state)){
  			if(Array.isArray(value)){
  				districtList.push(...value);	
  			}
  		}
	}

	
	return res.status(200).send({"message":"Success", states: stateList, districts:districtList, gender:gender, height});

}