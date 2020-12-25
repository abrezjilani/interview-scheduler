const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Team = require("./team");
const Applicant = require("./applicants");

mongoose
  .connect("mongodb://localhost:27017/interview", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const InterviewSchema = new Schema({
  a_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
    },
  ],
  hr_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  start: {
    type: String,
  },
  end: {
    type: String,
  },
});

const Interview = mongoose.model("Interview", InterviewSchema);
