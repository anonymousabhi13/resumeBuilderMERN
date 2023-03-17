const mongoose = require("mongoose");

const resumeModel = new mongoose.Schema(
  {
    personalinfo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    education: {
      type: Array,
      required: [true, "Education is required"],
    },
    skill: {
      type: Array,
      required: [true, "Skill is required"],
    },
    project: [],
    experience: [],
    interest: [],
  },

  { timestamps: true }
);

const Resume = mongoose.model("resume", resumeModel);
module.exports = Resume;
