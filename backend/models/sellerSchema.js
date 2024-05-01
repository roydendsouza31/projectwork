const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Seller",
  },
  companyName: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("seller", sellerSchema);
