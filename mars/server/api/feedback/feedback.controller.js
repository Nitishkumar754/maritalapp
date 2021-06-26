const Feedback = require('./feedback.model');
const messageMapper = require("../../lib/messageMapper");
const UserMessage  = messageMapper.language1;

function save_feedback(feedback_data){
const feedback = new Feedback({
	name:feedback_data.name,
	mobile_number:feedback_data.mobile_number,
	email: feedback_data.email,
	message:feedback_data.message

	})

	return feedback.save();
}

module.exports.post_feedback = async function(req, res){
	console.log("req.body>>>>>>>>>>>", req.body );
	const requestBody = req.body;
	
	if(!requestBody.name){
		return res.status(400).send({message: UserMessage.feedbackNameMissing});
	}
	if(!requestBody.message ){
		return res.status(400).send({"message":UserMessage.missingFeedbackMsg});
	}

	if(!requestBody.email &&  !requestBody.mobile_number){
		return res.status(400).send({"message":UserMessage.feedbackMissingEmailOrMobile});
	}

	try{
		const feedback = await save_feedback(req.body);
		return res.status(200).json({"message":UserMessage.feedbackSuccess});
	}
	catch(e){
		console.log("feedback error", e);
		return res.status(500).json({"message":UserMessage.feedbackFail});
	}
	
}


module.exports.getFeedback = async  (req, res) => {
	

	try{
		const feedback = await Feedback.find({})
		res.status(200).json({feedback, "message":"success"})
	}
	catch(e){
		res.status(500).json({feedback:[], "message":"Something went wrong"})
	}

}