const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const biodataCollectionSchema = mongoose.Schema(
  {
    uploadedBy: String,
    mobileNumber: String,
    biodDataUrl: String,
    photoUrl1: String,
    photoUrl2: String,
    gender: String,
    paymentStatus: { type: String, default: 'pending'},
    verificationStatus: {type: String, default: 'pending'},
    amount: Number,
    message: String

  },
  { timestamps: true }
);

module.exports = mongoose.model('biodataCollectionProgram', biodataCollectionSchema, 'biodataCollectionProgram');
