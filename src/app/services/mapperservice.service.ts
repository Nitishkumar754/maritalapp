import { Injectable, Input } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() { }
  searched_data:any;

  complexion: { key: string, value: string }[] = [
    { "key": "fair", "value": "Fair" },
    { "key": "brown", "value": "Brown" },
    { "key": "wheetish brown", "value": "Wheetish Brown" },
    { "key": "wheetish", "value": "Wheetish" },
    { "key": "other", "value": "Other" }
	];

blood_group: { key: string, value: string }[] = [
    { "key": "o+", "value": "O+" },
    { "key": "a+", "value": "A+" },
    { "key": "b+", "value": "B+" },
    { "key": "ab+", "value": "AB+" },
    { "key": "o-", "value": "O-" },
    { "key": "a-", "value": "A-" },
    { "key": "b-", "value": "B-" },
    { "key": "ab-", "value": "AB-" },
    { "key": "other-", "value": "Other" },
	];


religion:{key:string, name:string, cast:{ key: string, value: string }[]}[]=[
	{"key":"hindu", name:"Hindu", 
		cast: [
	    { "key": "koeri", "value": "Koeri/Dangi" },
	    { "key": "kurmi", "value": "Kurmi" },
	    { "key": "kushwaha", "value": "Kushwaha" },
	    { "key": "lohar", "value": "Lohar" },
	    { "key": "rajput", "value": "Rajput" },
	    { "key": "brahman", "value": "Brahman" },
	    { "key": "bhumihar", "value": "Bhumihar" },
	    { "key": "yadav", "value": "Yadav" },
	    { "key": "other", "value": "Other" },
		]
	},	

	{"key":"muslim", name:"Muslim", 
		cast: [
	    { "key": "khan", "value": "Khan" },
	    { "key": "other", "value": "Other" },
		]
	},

	{"key":"christian", name:"Christian", 
		cast: [
	    
		]
	},
	{"key":"sikh", name:"Sikh", 
		cast: [
	    
		]
	},
	{"key":"jain", name:"Jain", 
		cast: [
	    
		]
	},
	{"key":"other", name:"Other", 
		cast: [
	    
		]
	}				

]

cast: { key: string, value: string }[] = [
    { "key": "koeri", "value": "Koeri/Dangi" },
    { "key": "kurmi", "value": "Kurmi" },
    { "key": "kushwaha", "value": "Kushwaha" },
    { "key": "lohar", "value": "Lohar" },
    { "key": "rajput", "value": "Rajput" },
    { "key": "brahman", "value": "Brahman" },
    { "key": "bhumihar", "value": "Bhumihar" },
    { "key": "yadav", "value": "Yadav" },
    { "key": "other", "value": "Other" },
	];



raasi: { key: string, value: string }[] = [
    { "key": "aries", "value": "Aries/मेष" },
    { "key": "taurus", "value": "Taurus/वृष" },
    { "key": "gemini", "value": "Gemini/मिथुन" },
    { "key": "cancer", "value": "Cancer/कर्क" },
    { "key": "leo", "value": "Leo/सिंह" },
    { "key": "virgo", "value": "Virgo/कन्या" },
    { "key": "Libra", "value": "Libra/तुला" },
    { "key": "scorpio", "value": "Scorpio/वृश्चिक" },
    { "key": "sagittarius", "value": "Sagittarius/धनु" },
    { "key": "capricorn", "value": "Capricorn/मकर" },
    { "key": "aquarius", "value": "Aquarius/कुंभ" },
    { "key": "pisces", "value": "Pisces/मीन" },
	];

drink : { key: string, value: string}[] = [
	{"key":"yes", "value":"Yes"},
	{"key":"no", "value":"No"},
	{"key":"occassionaly", "value":"Occassionaly"}
];
smoke : { key: string, value: string}[] = [
	{"key":"yes", "value":"Yes"},
	{"key":"no", "value":"No"},
	{"key":"occassionaly", "value":"Occassionaly"}
];


marital_list : { key: string, value: string}[] = [
	{"key":"never married", "value":"Never Married"},
	{"key":"married", "value":"Married"},
	{"key":"divorced", "value":"Divorced"}
];
body_list : { key: string, value: string}[] = [
	{"key":"slim", "value":"Slim"},
	{"key":"athletic", "value":"Athletic"},
	{"key":"average", "value":"Average"},
	{"key":"healthy", "value":"Healthy"}
];

profile_managed_by : { key: string, value: string}[] = [
	{"key":"self", "value":"Self"},
	{"key":"parents", "value":"Parents"},
	{"key":"sibling", "value":"Siblings"},
	{"key":"other", "value":"Other"}
];

occupation_type: { key: string, value: string }[] = [
    { "key": "government", "value": "Government" },
    { "key": "private", "value": "Private" },
    { "key": "business", "value": "Business" },
    { "key": "other", "value": "Other" }
	];

higher_education : { key: string, value: string }[] = [
	{ "key": "10th", "value": "Matric/10th" },
	{ "key": "12th", "value": "Intermediate/12th" },
	{ "key": "ba", "value": "BA" },
	{ "key": "bsc", "value": "B.Sc" },
	{ "key": "bcom", "value": "B.Com" },
	{ "key": "btech", "value": "B.Tech" },
	{ "key": "bed", "value": "B.Ed" },
	{ "key": "barch", "value": "B.Arch" },
	{ "key": "llb", "value": "LLB" },
	{ "key": "bca", "value": "BCA" },
	{ "key": 'bba', "value": "BBA" },
	{ "key": "ma", "value": "MA" },
	{ "key": "msc", "value": "M.Sc" },
	{ "key": "mcom", "value": "M.Com" },
	{ "key": "mbbs", "value": "MBBS" },
	{ "key": "mca", "value": "MCA" },
	{ "key": 'mba', "value": "MBA" },
	{ "key": 'mpha', "value": "M.Pharma" },
	{ "key": 'phd', "value": "PHD" },
	{ "key": 'other', "value": "Other" }
	
];



annual_income: { key: string, value: string }[] = [
    { "key": "<1", "value": "< 1 Lakh " },
    { "key": "1", "value": " < 1 - 3 Lakh" },
    { "key": "3-5", "value": "< 3 - 5 Lakh" },
    { "key": "5-7", "value": "5 - 7 lakh" },
    { "key": "7-10", "value": "7 - 10 Lakh" },
    { "key": "10-15", "value": "10 - 15 Lakh" },
    { "key": ">15", "value": "> 15 Lakh" }
	];

state: { key: string, value: string}[] = [
	{"key":"AN", "value":"Andaman and Nicobar Islands"},
    {"key":"AP","value":"Andhra Pradesh"},
    {"key":"AR","value":"Arunachal Pradesh"},
    {"key":"AS","value":"Assam"},
    {"key":"BR","value":"Bihar"},
    {"key":"CG","value":"Chandigarh"},
    {"key":"CH","value":"Chhattisgarh"},
    {"key":"DN","value":"Dadra and Nagar Haveli"},
    {"key":"DD","value":"Daman and Diu"},
    {"key":"DL","value":"Delhi"},
    {"key":"GA","value":"Goa"},
    {"key":"GJ","value":"Gujarat"},
    {"key":"HR","value":"Haryana"},
    {"key":"HP","value":"Himachal Pradesh"},
    {"key":"JK","value":"Jammu and Kashmir"},
    {"key":"JH","value":"Jharkhand"},
    {"key":"KA","value":"Karnataka"},
    {"key":"KL","value":"Kerala"},
    {"key":"LA","value":"Ladakh"},
    {"key":"LD","value":"Lakshadweep"},
    {"key":"MP","value":"Madhya Pradesh"},
    {"key":"MH","value":"Maharashtra"},
    {"key":"MN","value":"Manipur"},
    {"key":"ML","value":"Meghalaya"},
    {"key":"MZ","value":"Mizoram"},
    {"key":"NL","value":"Nagaland"},
    {"key":"OR","value":"Odisha"},
    {"key":"PY","value":"Puducherry"},
    {"key":"PB","value":"Punjab"},
    {"key":"RJ","value":"Rajasthan"},
    {"key":"SK","value":"Sikkim"},
    {"key":"TN","value":"Tamil Nadu"},
    {"key":"TS","value":"Telangana"},
    {"key":"TR","value":"Tripura"},
    {"key":"UP","value":"Uttar Pradesh"},
    {"key":"UK","value":"Uttarakhand"},
    {"key":"WB","value":"West Bengal"}
];


state_district  = 
{  
   "states":[  
      {  
         "state":"Andhra Pradesh",
         "state_code":"AP",
         "districts":[  
            "Anantapur",
            "Chittoor",
            "East Godavari",
            "Guntur",
            "Krishna",
            "Kurnool",
            "Nellore",
            "Prakasam",
            "Srikakulam",
            "Visakhapatnam",
            "Vizianagaram",
            "West Godavari",
            "YSR Kadapa"
         ]
      },
      {  
         "state":"Arunachal Pradesh",
         "state_code":"AR",
         "districts":[  
            "Tawang",
            "West Kameng",
            "East Kameng",
            "Papum Pare",
            "Kurung Kumey",
            "Kra Daadi",
            "Lower Subansiri",
            "Upper Subansiri",
            "West Siang",
            "East Siang",
            "Siang",
            "Upper Siang",
            "Lower Siang",
            "Lower Dibang Valley",
            "Dibang Valley",
            "Anjaw",
            "Lohit",
            "Namsai",
            "Changlang",
            "Tirap",
            "Longding"
         ]
      },
      {  
         "state":"Assam",
         "state_code":"AS",
         "districts":[  
            "Baksa",
            "Barpeta",
            "Biswanath",
            "Bongaigaon",
            "Cachar",
            "Charaideo",
            "Chirang",
            "Darrang",
            "Dhemaji",
            "Dhubri",
            "Dibrugarh",
            "Goalpara",
            "Golaghat",
            "Hailakandi",
            "Hojai",
            "Jorhat",
            "Kamrup Metropolitan",
            "Kamrup",
            "Karbi Anglong",
            "Karimganj",
            "Kokrajhar",
            "Lakhimpur",
            "Majuli",
            "Morigaon",
            "Nagaon",
            "Nalbari",
            "Dima Hasao",
            "Sivasagar",
            "Sonitpur",
            "South Salmara-Mankachar",
            "Tinsukia",
            "Udalguri",
            "West Karbi Anglong"
         ]
      },
      {  
         "state":"Bihar",
         "state_code":"BR",
         "districts":[  
            "Araria",
            "Arwal",
            "Aurangabad",
            "Banka",
            "Begusarai",
            "Bhagalpur",
            "Bhojpur",
            "Buxar",
            "Darbhanga",
            "East Champaran (Motihari)",
            "Gaya",
            "Gopalganj",
            "Jamui",
            "Jehanabad",
            "Kaimur (Bhabua)",
            "Katihar",
            "Khagaria",
            "Kishanganj",
            "Lakhisarai",
            "Madhepura",
            "Madhubani",
            "Munger (Monghyr)",
            "Muzaffarpur",
            "Nalanda",
            "Nawada",
            "Patna",
            "Purnia (Purnea)",
            "Rohtas",
            "Saharsa",
            "Samastipur",
            "Saran",
            "Sheikhpura",
            "Sheohar",
            "Sitamarhi",
            "Siwan",
            "Supaul",
            "Vaishali",
            "West Champaran"
         ]
      },
      {  
         "state":"Chandigarh (UT)",
         "state_code":"CG",
         "districts":[  
            "Chandigarh"
         ]
      },
      {  
         "state":"Chhattisgarh",
         "state_code":"CH",
         "districts":[  
            "Balod",
            "Baloda Bazar",
            "Balrampur",
            "Bastar",
            "Bemetara",
            "Bijapur",
            "Bilaspur",
            "Dantewada (South Bastar)",
            "Dhamtari",
            "Durg",
            "Gariyaband",
            "Janjgir-Champa",
            "Jashpur",
            "Kabirdham (Kawardha)",
            "Kanker (North Bastar)",
            "Kondagaon",
            "Korba",
            "Korea (Koriya)",
            "Mahasamund",
            "Mungeli",
            "Narayanpur",
            "Raigarh",
            "Raipur",
            "Rajnandgaon",
            "Sukma",
            "Surajpur  ",
            "Surguja"
         ]
      },
      {  
         "state":"Dadra and Nagar Haveli (UT)",
         "state_code":"DN",
         "districts":[  
            "Dadra & Nagar Haveli"
         ]
      },
      {  
         "state":"Daman and Diu (UT)",
         "state_code":"DD",
         "districts":[  
            "Daman",
            "Diu"
         ]
      },
      {  
         "state":"Delhi (NCT)",
         "state_code":"DL",
         "districts":[  
            "Central Delhi",
            "East Delhi",
            "New Delhi",
            "North Delhi",
            "North East  Delhi",
            "North West  Delhi",
            "Shahdara",
            "South Delhi",
            "South East Delhi",
            "South West  Delhi",
            "West Delhi"
         ]
      },
      {  
         "state":"Goa",
         "state_code":"GA",
         "districts":[  
            "North Goa",
            "South Goa"
         ]
      },
      {  
         "state":"Gujarat",
         "state_code":"GJ",
         "districts":[  
            "Ahmedabad",
            "Amreli",
            "Anand",
            "Aravalli",
            "Banaskantha (Palanpur)",
            "Bharuch",
            "Bhavnagar",
            "Botad",
            "Chhota Udepur",
            "Dahod",
            "Dangs (Ahwa)",
            "Devbhoomi Dwarka",
            "Gandhinagar",
            "Gir Somnath",
            "Jamnagar",
            "Junagadh",
            "Kachchh",
            "Kheda (Nadiad)",
            "Mahisagar",
            "Mehsana",
            "Morbi",
            "Narmada (Rajpipla)",
            "Navsari",
            "Panchmahal (Godhra)",
            "Patan",
            "Porbandar",
            "Rajkot",
            "Sabarkantha (Himmatnagar)",
            "Surat",
            "Surendranagar",
            "Tapi (Vyara)",
            "Vadodara",
            "Valsad"
         ]
      },
      {  
         "state":"Haryana",
         "state_code":"HR",
         "districts":[  
            "Ambala",
            "Bhiwani",
            "Charkhi Dadri",
            "Faridabad",
            "Fatehabad",
            "Gurgaon",
            "Hisar",
            "Jhajjar",
            "Jind",
            "Kaithal",
            "Karnal",
            "Kurukshetra",
            "Mahendragarh",
            "Mewat",
            "Palwal",
            "Panchkula",
            "Panipat",
            "Rewari",
            "Rohtak",
            "Sirsa",
            "Sonipat",
            "Yamunanagar"
         ]
      },
      {  
         "state":"Himachal Pradesh",
         "state_code":"HP",
         "districts":[  
            "Bilaspur",
            "Chamba",
            "Hamirpur",
            "Kangra",
            "Kinnaur",
            "Kullu",
            "Lahaul &amp; Spiti",
            "Mandi",
            "Shimla",
            "Sirmaur (Sirmour)",
            "Solan",
            "Una"
         ]
      },
      {  
         "state":"Jammu and Kashmir",
         "state_code":"JK",
         "districts":[  
            "Anantnag",
            "Bandipore",
            "Baramulla",
            "Budgam",
            "Doda",
            "Ganderbal",
            "Jammu",
            "Kargil",
            "Kathua",
            "Kishtwar",
            "Kulgam",
            "Kupwara",
            "Leh",
            "Poonch",
            "Pulwama",
            "Rajouri",
            "Ramban",
            "Reasi",
            "Samba",
            "Shopian",
            "Srinagar",
            "Udhampur"
         ]
      },
      {  
         "state":"Jharkhand",
         "state_code":"JH",
         "districts":[  
            "Bokaro",
            "Chatra",
            "Deoghar",
            "Dhanbad",
            "Dumka",
            "East Singhbhum",
            "Garhwa",
            "Giridih",
            "Godda",
            "Gumla",
            "Hazaribag",
            "Jamtara",
            "Khunti",
            "Koderma",
            "Latehar",
            "Lohardaga",
            "Pakur",
            "Palamu",
            "Ramgarh",
            "Ranchi",
            "Sahibganj",
            "Seraikela-Kharsawan",
            "Simdega",
            "West Singhbhum"
         ]
      },
      {  
         "state":"Karnataka",
         "state_code":"KA",
         "districts":[  
            "Bagalkot",
            "Ballari (Bellary)",
            "Belagavi (Belgaum)",
            "Bengaluru (Bangalore) Rural",
            "Bengaluru (Bangalore) Urban",
            "Bidar",
            "Chamarajanagar",
            "Chikballapur",
            "Chikkamagaluru (Chikmagalur)",
            "Chitradurga",
            "Dakshina Kannada",
            "Davangere",
            "Dharwad",
            "Gadag",
            "Hassan",
            "Haveri",
            "Kalaburagi (Gulbarga)",
            "Kodagu",
            "Kolar",
            "Koppal",
            "Mandya",
            "Mysuru (Mysore)",
            "Raichur",
            "Ramanagara",
            "Shivamogga (Shimoga)",
            "Tumakuru (Tumkur)",
            "Udupi",
            "Uttara Kannada (Karwar)",
            "Vijayapura (Bijapur)",
            "Yadgir"
         ]
      },
      {  
         "state":"Kerala",
         "state_code":"KL",
         "districts":[  
            "Alappuzha",
            "Ernakulam",
            "Idukki",
            "Kannur",
            "Kasaragod",
            "Kollam",
            "Kottayam",
            "Kozhikode",
            "Malappuram",
            "Palakkad",
            "Pathanamthitta",
            "Thiruvananthapuram",
            "Thrissur",
            "Wayanad"
         ]
      },
      {  
         "state":"Lakshadweep (UT)",
         "state_code":"LA",
         "districts":[  
            "Agatti",
            "Amini",
            "Androth",
            "Bithra",
            "Chethlath",
            "Kavaratti",
            "Kadmath",
            "Kalpeni",
            "Kilthan",
            "Minicoy"
         ]
      },
      {  
         "state":"Madhya Pradesh",
         "state_code":"MP",
         "districts":[  
            "Agar Malwa",
            "Alirajpur",
            "Anuppur",
            "Ashoknagar",
            "Balaghat",
            "Barwani",
            "Betul",
            "Bhind",
            "Bhopal",
            "Burhanpur",
            "Chhatarpur",
            "Chhindwara",
            "Damoh",
            "Datia",
            "Dewas",
            "Dhar",
            "Dindori",
            "Guna",
            "Gwalior",
            "Harda",
            "Hoshangabad",
            "Indore",
            "Jabalpur",
            "Jhabua",
            "Katni",
            "Khandwa",
            "Khargone",
            "Mandla",
            "Mandsaur",
            "Morena",
            "Narsinghpur",
            "Neemuch",
            "Panna",
            "Raisen",
            "Rajgarh",
            "Ratlam",
            "Rewa",
            "Sagar",
            "Satna",
            "Sehore",
            "Seoni",
            "Shahdol",
            "Shajapur",
            "Sheopur",
            "Shivpuri",
            "Sidhi",
            "Singrauli",
            "Tikamgarh",
            "Ujjain",
            "Umaria",
            "Vidisha"
         ]
      },
      {  
         "state":"Maharashtra",
         "state_code":"UP",
         "districts":[  
            "Ahmednagar",
            "Akola",
            "Amravati",
            "Aurangabad",
            "Beed",
            "Bhandara",
            "Buldhana",
            "Chandrapur",
            "Dhule",
            "Gadchiroli",
            "Gondia",
            "Hingoli",
            "Jalgaon",
            "Jalna",
            "Kolhapur",
            "Latur",
            "Mumbai City",
            "Mumbai Suburban",
            "Nagpur",
            "Nanded",
            "Nandurbar",
            "Nashik",
            "Osmanabad",
            "Palghar",
            "Parbhani",
            "Pune",
            "Raigad",
            "Ratnagiri",
            "Sangli",
            "Satara",
            "Sindhudurg",
            "Solapur",
            "Thane",
            "Wardha",
            "Washim",
            "Yavatmal"
         ]
      },
      {  
         "state":"Manipur",
         "state_code":"MN",
         "districts":[  
            "Bishnupur",
            "Chandel",
            "Churachandpur",
            "Imphal East",
            "Imphal West",
            "Jiribam",
            "Kakching",
            "Kamjong",
            "Kangpokpi",
            "Noney",
            "Pherzawl",
            "Senapati",
            "Tamenglong",
            "Tengnoupal",
            "Thoubal",
            "Ukhrul"
         ]
      },
      {  
         "state":"Meghalaya",
         "state_code":"ML",
         "districts":[  
            "East Garo Hills",
            "East Jaintia Hills",
            "East Khasi Hills",
            "North Garo Hills",
            "Ri Bhoi",
            "South Garo Hills",
            "South West Garo Hills ",
            "South West Khasi Hills",
            "West Garo Hills",
            "West Jaintia Hills",
            "West Khasi Hills"
         ]
      },
      {  
         "state":"Mizoram",
         "state_code":"MZ",
         "districts":[  
            "Aizawl",
            "Champhai",
            "Kolasib",
            "Lawngtlai",
            "Lunglei",
            "Mamit",
            "Saiha",
            "Serchhip"
         ]
      },
      {  
         "state":"Nagaland",
         "state_code":"NL",
         "districts":[  
            "Dimapur",
            "Kiphire",
            "Kohima",
            "Longleng",
            "Mokokchung",
            "Mon",
            "Peren",
            "Phek",
            "Tuensang",
            "Wokha",
            "Zunheboto"
         ]
      },
      {  
         "state":"Odisha",
         "state_code":"OR",
         "districts":[  
            "Angul",
            "Balangir",
            "Balasore",
            "Bargarh",
            "Bhadrak",
            "Boudh",
            "Cuttack",
            "Deogarh",
            "Dhenkanal",
            "Gajapati",
            "Ganjam",
            "Jagatsinghapur",
            "Jajpur",
            "Jharsuguda",
            "Kalahandi",
            "Kandhamal",
            "Kendrapara",
            "Kendujhar (Keonjhar)",
            "Khordha",
            "Koraput",
            "Malkangiri",
            "Mayurbhanj",
            "Nabarangpur",
            "Nayagarh",
            "Nuapada",
            "Puri",
            "Rayagada",
            "Sambalpur",
            "Sonepur",
            "Sundargarh"
         ]
      },
      {  
         "state":"Puducherry (UT)",
         "state_code":"PY",
         "districts":[  
            "Karaikal",
            "Mahe",
            "Pondicherry",
            "Yanam"
         ]
      },
      {  
         "state":"Punjab",
         "state_code":"PB",
         "districts":[  
            "Amritsar",
            "Barnala",
            "Bathinda",
            "Faridkot",
            "Fatehgarh Sahib",
            "Fazilka",
            "Ferozepur",
            "Gurdaspur",
            "Hoshiarpur",
            "Jalandhar",
            "Kapurthala",
            "Ludhiana",
            "Mansa",
            "Moga",
            "Muktsar",
            "Nawanshahr (Shahid Bhagat Singh Nagar)",
            "Pathankot",
            "Patiala",
            "Rupnagar",
            "Sahibzada Ajit Singh Nagar (Mohali)",
            "Sangrur",
            "Tarn Taran"
         ]
      },
      {  
         "state":"Rajasthan",
         "state_code":"RJ",
         "districts":[  
            "Ajmer",
            "Alwar",
            "Banswara",
            "Baran",
            "Barmer",
            "Bharatpur",
            "Bhilwara",
            "Bikaner",
            "Bundi",
            "Chittorgarh",
            "Churu",
            "Dausa",
            "Dholpur",
            "Dungarpur",
            "Hanumangarh",
            "Jaipur",
            "Jaisalmer",
            "Jalore",
            "Jhalawar",
            "Jhunjhunu",
            "Jodhpur",
            "Karauli",
            "Kota",
            "Nagaur",
            "Pali",
            "Pratapgarh",
            "Rajsamand",
            "Sawai Madhopur",
            "Sikar",
            "Sirohi",
            "Sri Ganganagar",
            "Tonk",
            "Udaipur"
         ]
      },
      {  
         "state":"Sikkim",
         "state_code":"SK",
         "districts":[  
            "East Sikkim",
            "North Sikkim",
            "South Sikkim",
            "West Sikkim"
         ]
      },
      {  
         "state":"Tamil Nadu",
         "state_code":"TN",
         "districts":[  
            "Ariyalur",
            "Chennai",
            "Coimbatore",
            "Cuddalore",
            "Dharmapuri",
            "Dindigul",
            "Erode",
            "Kanchipuram",
            "Kanyakumari",
            "Karur",
            "Krishnagiri",
            "Madurai",
            "Nagapattinam",
            "Namakkal",
            "Nilgiris",
            "Perambalur",
            "Pudukkottai",
            "Ramanathapuram",
            "Salem",
            "Sivaganga",
            "Thanjavur",
            "Theni",
            "Thoothukudi (Tuticorin)",
            "Tiruchirappalli",
            "Tirunelveli",
            "Tiruppur",
            "Tiruvallur",
            "Tiruvannamalai",
            "Tiruvarur",
            "Vellore",
            "Viluppuram",
            "Virudhunagar"
         ]
      },
      {  
         "state":"Telangana",
         "state_code":"TS",
         "districts":[  
            "Adilabad",
            "Bhadradri Kothagudem",
            "Hyderabad",
            "Jagtial",
            "Jangaon",
            "Jayashankar Bhoopalpally",
            "Jogulamba Gadwal",
            "Kamareddy",
            "Karimnagar",
            "Khammam",
            "Komaram Bheem Asifabad",
            "Mahabubabad",
            "Mahabubnagar",
            "Mancherial",
            "Medak",
            "Medchal",
            "Nagarkurnool",
            "Nalgonda",
            "Nirmal",
            "Nizamabad",
            "Peddapalli",
            "Rajanna Sircilla",
            "Rangareddy",
            "Sangareddy",
            "Siddipet",
            "Suryapet",
            "Vikarabad",
            "Wanaparthy",
            "Warangal (Rural)",
            "Warangal (Urban)",
            "Yadadri Bhuvanagiri"
         ]
      },
      {  
         "state":"Tripura",
         "state_code":"TR",
         "districts":[  
            "Dhalai",
            "Gomati",
            "Khowai",
            "North Tripura",
            "Sepahijala",
            "South Tripura",
            "Unakoti",
            "West Tripura"
         ]
      },
      {  
         "state":"Uttarakhand",
         "state_code":"UK",
         "districts":[  
            "Almora",
            "Bageshwar",
            "Chamoli",
            "Champawat",
            "Dehradun",
            "Haridwar",
            "Nainital",
            "Pauri Garhwal",
            "Pithoragarh",
            "Rudraprayag",
            "Tehri Garhwal",
            "Udham Singh Nagar",
            "Uttarkashi"
         ]
      },
      {  
         "state":"Uttar Pradesh",
         "state_code":"UP",
         "districts":[  
            "Agra",
            "Aligarh",
            "Allahabad",
            "Ambedkar Nagar",
            "Amethi (Chatrapati Sahuji Mahraj Nagar)",
            "Amroha (J.P. Nagar)",
            "Auraiya",
            "Azamgarh",
            "Baghpat",
            "Bahraich",
            "Ballia",
            "Balrampur",
            "Banda",
            "Barabanki",
            "Bareilly",
            "Basti",
            "Bhadohi",
            "Bijnor",
            "Budaun",
            "Bulandshahr",
            "Chandauli",
            "Chitrakoot",
            "Deoria",
            "Etah",
            "Etawah",
            "Faizabad",
            "Farrukhabad",
            "Fatehpur",
            "Firozabad",
            "Gautam Buddha Nagar",
            "Ghaziabad",
            "Ghazipur",
            "Gonda",
            "Gorakhpur",
            "Hamirpur",
            "Hapur (Panchsheel Nagar)",
            "Hardoi",
            "Hathras",
            "Jalaun",
            "Jaunpur",
            "Jhansi",
            "Kannauj",
            "Kanpur Dehat",
            "Kanpur Nagar",
            "Kanshiram Nagar (Kasganj)",
            "Kaushambi",
            "Kushinagar (Padrauna)",
            "Lakhimpur - Kheri",
            "Lalitpur",
            "Lucknow",
            "Maharajganj",
            "Mahoba",
            "Mainpuri",
            "Mathura",
            "Mau",
            "Meerut",
            "Mirzapur",
            "Moradabad",
            "Muzaffarnagar",
            "Pilibhit",
            "Pratapgarh",
            "RaeBareli",
            "Rampur",
            "Saharanpur",
            "Sambhal (Bhim Nagar)",
            "Sant Kabir Nagar",
            "Shahjahanpur",
            "Shamali (Prabuddh Nagar)",
            "Shravasti",
            "Siddharth Nagar",
            "Sitapur",
            "Sonbhadra",
            "Sultanpur",
            "Unnao",
            "Varanasi"
         ]
      },
      {  
         "state":"West Bengal",
         "state_code":"WB",
         "districts":[  
            "Alipurduar",
            "Bankura",
            "Birbhum",
            "Burdwan (Bardhaman)",
            "Cooch Behar",
            "Dakshin Dinajpur (South Dinajpur)",
            "Darjeeling",
            "Hooghly",
            "Howrah",
            "Jalpaiguri",
            "Kalimpong",
            "Kolkata",
            "Malda",
            "Murshidabad",
            "Nadia",
            "North 24 Parganas",
            "Paschim Medinipur (West Medinipur)",
            "Purba Medinipur (East Medinipur)",
            "Purulia",
            "South 24 Parganas",
            "Uttar Dinajpur (North Dinajpur)"
         ]
      }
   ]
}



}




