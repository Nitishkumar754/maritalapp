var Feedback = require('./feedback.model');

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
	try{
		const feedback = await save_feedback(req.body);
		res.status(200).json({"message":"Thank You!! We have received your message"})
	}
	catch(e){
		console.log("feedback error", e);
		res.status(500).json({"message":"Something went wrong! Your message couldn't be saved"})
	}
	
}