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
	{"key":"healthy", "value":"Healthy"}
];



}

