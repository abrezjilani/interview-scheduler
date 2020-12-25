const express = require("express"),
  bodyParser = require("body-parser"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  app = express();

const port = 8000;

//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true }));

const Team = require("./models/team");
const Applicant = require("./models/applicants");
const Schema = mongoose.Schema;

//MONGODB/MONGOOSE CONFIG
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
  a_name: { type: String },
  a_image: { type: String },
  hr_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  hr_name: { type: String },
  start: {
    type: String,
  },
  end: {
    type: String,
  },
});

const Interview = mongoose.model("Interview", InterviewSchema);

// Applicant.create({
//   name: "John",
//   image:
//     "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
// });
// Applicant.create({
//   name: "Wick",
//   image:
//     "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29ufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });
// Applicant.create({
//   name: "Elena",
//   image:
//     "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });
// Applicant.create({
//   name: "Tim",
//   image:
//     "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });

// Team.create({
//   name: "Jessie",
//   image:
//     "https://images.unsplash.com/photo-1575405369708-44948c7d9fcc?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDZ8fHByb2Zlc3Npb25hbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });
// Team.create({
//   name: "Shane",
//   image:
//     "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2Zlc3Npb25hbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });
// Team.create({
//   name: "Clement",
//   image:
//     "https://images.unsplash.com/photo-1558203728-00f45181dd84?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mzh8fHByb2Zlc3Npb25hbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });
// Team.create({
//   name: "Jason",
//   image:
//     "https://images.unsplash.com/photo-1514222788835-3a1a1d5b32f8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2Zlc3Npb25hbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
// });

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/interviews", (req, res) => {
  Team.find()
    .then((team) => {
      res.render("show", { team: team });
      console.log(typeof team);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/interview/new", (req, res) => {
  Team.find()
    .then((team) => {
      Applicant.find()
        .then((applicant) => {
          const pool = { team: team, applicants: applicant };
          res.render("new", { pool: pool });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/interviews/:id/edit", (req, res) => {
  res.render("edit");
});

app.post("/interviews", (req, res) => {
  // console.log(typeof req.body.start_time);
  const start_time = req.body.start_time.replace(":", "");
  const end_time = req.body.end_time.replace(":", "");

  const team_members = [...req.body.team.name];
  const applicant_members = [...req.body.applicant.name];
  applicant_members.forEach((applicant) => {
    // console.log(applicant);
    Applicant.update(
      { name: applicant },
      {
        $$push: {
          interviews: { start_time: start_time, end_time: end_time },
        },
      }
    );
  });
  team_members.forEach((member) => {
    Team.update(
      { name: member },
      {
        $$push: {
          interviews: { start_time: start_time, end_time: end_time },
        },
      }
    );
  });
  res.redirect("/interviews");
});

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
