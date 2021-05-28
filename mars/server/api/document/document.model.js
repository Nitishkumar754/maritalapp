var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var documentSchema = new Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    url: { type: String },
    status: { type: String, default: "approved" }, //can be approved, pending, rejected
    rejectionReason: { type: String },
    type: { type: String },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
