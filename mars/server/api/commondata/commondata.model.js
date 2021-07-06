const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const commondataSchema = mongoose.Schema(
  {
    name: String,
    isActive: {type: Boolean, default:true},
    data: [{}]
  },
  { timestamps: true }
);

module.exports = mongoose.model('commondata', commondataSchema, 'commondata');
