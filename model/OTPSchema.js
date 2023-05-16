const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  OTP1: {
    type: String,
    require: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = { OTP };
