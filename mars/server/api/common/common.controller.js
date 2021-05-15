let Constant = require('../../lib/constant');

module.exports.getAllMapper = async(req, res)=>{
	let requestBody = req.body;
	let response = {}
	if(requestBody.state){
		let stateDistrictMapper = Constant.states;
		let stateList = [];
		for (const [, state] of Object.entries(stateDistrictMapper)) {
  			stateList.push({key:state.state_code.toLowerCase(), value:state.state})
		}
		response.states = stateList;
	}

	if(requestBody.district){
		let districtList = [];
		let stateDistrictMapper = Constant.states;
		for (const [, state] of Object.entries(stateDistrictMapper)) {
	  		for(const[, value] of Object.entries(state)){
	  			if(Array.isArray(value)){
	  				districtList.push(...value);	
	  			}
	  		}
		}
		districtList = districtList.map(district=>{
			return{key:district.toLowerCase(), value:district};
		})
		response.districts = districtList;
	}

	if(requestBody.stateDistrict){
		response.stateDistrict = Constant.states;
	}

	let education = Constant.education;
	let occupation = Constant.occupation;
	let caste_list = Constant.caste_list;
	let religion_list = Constant.religion_list;
	if(requestBody.education)  response.education = Constant.education;
	if(requestBody.occupation) response.occupation = Constant.occupation;
	if(requestBody.caste) response.caste_list = Constant.caste_list;
	if(requestBody.religion) response.religion_list = Constant.religion_list;
	if(requestBody.marital) response.maritalList = Constant.maritalList;

	if(requestBody.gender) response.gender = Constant.gender;
	if(requestBody.height) response.heights = Constant.height;
	if(requestBody.raasi) response.raasi = Constant.raasi;

	if(requestBody.smoke) response.smoke = Constant.smoke;
	if(requestBody.drink) response.drink = Constant.drink;
	if(requestBody.foodType) response.foodTypes = Constant.foodType;

	if(requestBody.bloodGroup) response.bloodGroup = Constant.bloodGroup;
	if(requestBody.complexion) response.complexions = Constant.complexion;
	if(requestBody.bodyType) response.bodyType = Constant.bodyType;
	

	return res.status(200).send({"message":"Success", mapper:response});

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
  		stateList.push({key:state.state_code.toLowerCase(), value:state.state})
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