const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
    default: "download.png",
  },
  interviews: [
    {
      start_time: String,
      end_time: String,
    },
  ],
});

const Applicant = mongoose.model("Applicant", applicantSchema);
module.exports = Applicant;
