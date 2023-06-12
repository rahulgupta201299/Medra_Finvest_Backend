const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = Schema(
  {
	phoneNumber: {
		type: String,
	},
	otp: {
		type: String,
	}
  },
  {
    timestamps: true,
    index: true,
  }
);

const otpModel = new mongoose.model("otpverify", otpSchema);

module.exports = otpModel;
