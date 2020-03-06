var moment = require('moment');
var $q = require('q');
var uniqid = require('uniqid');
var  Accesscode  = require('./accesscode.model');

var Subscription = require('../subscription/subscription.model');
var User = require('../user/user.model');

var mailer = require("../../lib/mail.js");
var config = require("../../config/environment");
var MAX_ALLOWED_CODE=10;


function shuffle(code) {
    var a = code.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
     return a.join("");
}

function accesscode_generator(category,amount,count){
	var accesscodeList=[]
  

	for (var i=0;i<count;i++){
    var new_code = uniqid().slice(-16);
    new_code= shuffle(new_code);
		var accesscode_obj= {
			category_type:category,
			original_amount:amount,
			accesscode:new_code,
			active:true,
			used:false,
			created_at:new Date(),
			updated_at:new Date()
		}
	accesscodeList.push(accesscode_obj);

	}
  console.log("accesscodeList>>>>>>>>>>>>> ",accesscodeList);
	return accesscodeList;
	
}


async function save_accesscode (accesscode_list){
    console.log("accesscode_list>>>>>>>>>>>> ",accesscode_list)
    return Accesscode.insertMany(accesscode_list)
    
} 

module.exports.create =  async function(req, res) {

	var accesscodeObj = req.body;
	console.log("accesscodeObj>>>>>>>>>>>>> ",accesscodeObj);
	var index = ['basic', 'gold', 'premium'].indexOf(accesscodeObj.category);
	console.log("index>>>>>>>>>>>>>>> ", index )
	if (['basic', 'gold', 'premium'].indexOf(accesscodeObj.category) < 0) {
   			
   			res.status(400).send({status:false, "message":"Invalid category provided"})
			return;
		}

  if (accesscodeObj.code_count>MAX_ALLOWED_CODE){
    res.send({status:false, "message":"Max accesscode creation at once is "+MAX_ALLOWED_CODE+"!" })
      return;
  }

  try{
    var accesscode_list = accesscode_generator(accesscodeObj.category, accesscodeObj.amount, accesscodeObj.code_count);
  const accesscodes = await save_accesscode(accesscode_list);
  console.log("accesscodes>>>>>>>>>>> ",accesscodes);
  res.status(200).json({status:true, "message":"success"})     
  }
  catch(e){
    console.log("err2 >>>>>>>>> ",e);
      res.status(500).send({status:false,"message":"Error while generating Accesscode!"})
  }

}


function send_accesscode_list_in_mail(accesscode_list, order, user){
	var deferred = $q.defer();
	console.log("accesscode_list>>>>>>>>>>>>>>> ",accesscode_list);
	var html='';
	var list = [];
  html +='<div style="font-size:18px;padding:5px 0px;">'+
      '<div>Please find accesscode </div>'+
      '<div>Name : '+user.full_name+'</div>'+
      '<div>Email : '+user.email+'</div>'+
      '<div>Mobile Number : '+user.mobile_number+'</div>'+
      '<div>Number of access code : '+accesscode_list.length+'</div>'+
      '<div>Subscription Category: '+accesscode_list[0].category_type+'</div>'+
      '</div>';

	for (var i = 0; i < accesscode_list.length; i++) {
		var str = accesscode_list[i].accesscode;
		var code = str.substring(0, 4)+"-"+str.substring(4,8)+"-"+str.substring(8,12)+"-"+str.substring(12,17);
		
  		html += "<div style='font-size:16px; padding:5px;'>"+code + "</div>";
	}

	return mailer.sendMail(config.mail.sender, klj.admin_email, "Accesscode List", null, html, list)
}



module.exports.deleteAccesscode  = async function(req, res){
 
  var accesscode_id = req.params.id;

  Accesscode.findOne({_id:req.params.id, active:true}).then(function(accesscode){
    console.log("accesscode>>>>>>>>>> ",accesscode);
    if(!accesscode){
      res.status(400).send({message:"Invlalid detail provided"});
      return; 
    }
    if(accesscode.user || accesscode.used_status){
      res.status(400).send({message:"Can't delete, Already in use"});
      return;
    }

    Accesscode.update({_id:req.params.id}, {active:false},{upsert: true}, function(err, data){
      console.log("err>>>>>> ",err, "data>>>>>>>>>>>> ",data);
      if(err){
        res.status(500).send({"message":"Deactivation failed"});
        return;
      }
      res.status(200).send({"message":"Successfully deactivated"});
    })

  })
}




module.exports.listaccesscode = async(req, res) => {

  try{
    const accesscodes = await Accesscode.find({})
    res.status(200).json({accesscodes, "message":"success"})
  }
  catch(e){
    res.status(500).json({accesscodes:[], "message":"Something went wrong!"})
  }


}