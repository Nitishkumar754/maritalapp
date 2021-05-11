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
	let castes = Constant.caste_list;
	let religions = Constant.religion_list;
	let stateDistrictMapper = Constant.states;
	let stateList = [];
	let districtList = [];
	let gender = Constant.gender;
	let heights = Constant.height;
	let educations = Constant.education;
	let occupations = Constant.occupation;
	let bloodGroups = Constant.bloodGroup;
	let complexions = Constant.complexion;
	let raasi  = Constant.raasi;
	let bodyTypes = Constant.bodyType;
	let smoke = Constant.smoke;
	let drinks = Constant.drink;
	let foodTypes = Constant.foodType;
	let maritalList = Constant.maritalList;

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

	
	return res.status(200).send({
		"message":"Success", 
		states: stateList, 
		districts:districtList, 
		gender:gender, 
		heights,
		educations,
		occupations,
		castes,
		religions,
		complexions,
		bloodGroups,
		raasi,
		bodyTypes,
		foodTypes,
		smoke,
		drinks,
		maritalList


	});

}