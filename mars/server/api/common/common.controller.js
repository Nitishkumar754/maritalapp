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

module.exports.getAboutusDetail = async(req, res)=>{

const profiles = [];
const companyDetail = {
	showAddress: true,
	showMap: true,
	mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29044.811524781453!2d84.57577484277668!3d24.499262690415154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398cea12d38aa499%3A0x2d318f91ee1ff2b8!2sPakriguria%2C%20Bihar%20824206!5e0!3m2!1sen!2sin!4v1626288439959!5m2!1sen!2sin',
	name:'Jankalyan Technology Services',
	legalDescription:'',
	address: 'Guriya, PO - Pakriguriya, PS- Imamganj, Gaya- 824206, Bihar',
	description1: "+91-9020912410",
	description2: " +91-7488758820",
	description3: "shaadikarloweb0@gmail.com"
};

let user1 = {
	profileImage : "https://shaadikarlo.s3.ap-south-1.amazonaws.com/staticImages/website_photos/web_gallery/nitish_face.jpg",
	name: "Nitish Kumar",
	designation: "CO-FOUNDER",
	description1:"<b>Experienced Software Professional</b>",
	description2: "<a style='color:#c43b42;cursor:pointer;' target='_blank' href='https://www.linkedin.com/in/nitish-kumar-281777b1/'>LinkendIn Profile</a>",
	description3: "CSE Graduate From NIT Calicut",
	description4: "<span style='font-size:12px;font-style:italic;'>Making peoples' life easy with the help of technology</span>",
	description5:"Email: <b>nitish1500kumar@gmail.com</b>"
	};

let user2 = {
	profileImage : "https://shaadikarlo.s3.ap-south-1.amazonaws.com/staticImages/website_photos/web_gallery/praveen-min.png",
	name: "Praveen Kumar",
	designation: "CO-FOUNDER",
	description1:"<b>Teacher by Profession</b>",
	description2: "PHD (Geography)",
	description3: "",
	description5:"Email: <b>praveengbhs@gmail.com</b>"
	};


	profiles.push(user1);
	profiles.push(user2);
	


	return res.status(200).send({"message":"success", profiles, showTeam: true, companyDetail });

}