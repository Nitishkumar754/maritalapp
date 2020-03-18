var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var interactionSchema = new Schema({
  
  user: {type: mongoose.Schema.ObjectId, ref:'User'},
  
  interaction_type:{type:String, enum:['visitor', 'contacted', 'favourite','interest']},
  interacted_user: {type: mongoose.Schema.ObjectId, ref:'User'},
  interacted_profile:{type: mongoose.Schema.ObjectId, ref:'Profile'},


},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
);

var Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
