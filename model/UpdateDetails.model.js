const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpdateDetailSchema = Schema(
  {
    data: {
		  type: Array,
	  },
    update: {
      type: String,
    }
  },
  {
    timestamps: true,
    index: true,
  }
);

const updateDetailModel = new mongoose.model("updatedetails", UpdateDetailSchema);

module.exports = updateDetailModel;
