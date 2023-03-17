const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [4, "Name must have atleast 4 characters"],
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      minLength: [6, "Password must have atleast 6 characters"],
      required: [true, "Password is required"],
    },
    contact: {
      type: String,
      minLength: [10, "Contact must have 10 digits"],
      maxLength: [10, "Contact must have 10 digits"],
      required: [true, "Contact is required"],
    },
    avatar: {
      type: Object,
      default: {
        fileId: "",
        url: "https://images.unsplash.com/photo-1529641484336-ef35148bab06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
    },
    links: {
      type: Object,
      default: {
        linkedin: "",
        github: "",
        bechance: "",
      },
    },
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "resume" }],
    otp: String,
  },
  { timestamps: true }
);

userModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userModel.methods.getjwttoken = function () {
  return jwt.sign(
    { id: this._id },
    "secret",
    // process.env.JWT_SECRET
    {
      expiresIn: 3600, //process.env.JWT_TOKEN_EXPIRE,
    }
  );
};

const User = mongoose.model("user", userModel);
module.exports = User;
