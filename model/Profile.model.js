const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = Schema(
  {
    firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	phoneNumber: {
		type: String,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
	},
  },
  {
    timestamps: true,
    index: true,
  }
);

const profileModel = new mongoose.model("userdetails", profileSchema);

module.exports = profileModel;
