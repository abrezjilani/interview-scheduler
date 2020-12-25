const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interviewerSchema = new Schema({
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

const Interviewer = mongoose.model("Interviewer", interviewerSchema);
module.exports = Interviewer;
