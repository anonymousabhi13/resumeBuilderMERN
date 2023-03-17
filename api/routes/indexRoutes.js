const express = require("express");
const router = express.Router();

const {
  signupuser,
  homepage,
  signin,
  signout,
  getloggedInuser,
  sendmailotp,
  forgetpassword,
} = require("../controllers/indexControllers");
const { isAuthenticatedUser } = require("../middleware/auth");

// @route GET /
router.get("/", homepage);

// @route POST /createUser
router.post("/signup", signupuser);

// @route POST /signupUser
router.post("/signin", signin);


// @route POST /SignoutUser
router.post("/signout",isAuthenticatedUser, signout);


// @route POST /send-mailOtp
router.post("/sendmail", sendmailotp);


// @route POST /forgetPassword
router.post("/forgetpassword", forgetpassword);

module.exports = router;
