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
  resetpassword,
  updateuser,
  updateavatar,
  createresume,
  readsingleresume
} = require("../controllers/indexControllers");
const { isAuthenticatedUser } = require("../middleware/auth");

// @route GET /
router.get("/", homepage);

// @route POST /createUser
router.post("/signup", signupuser);

// @route POST /signupUser
router.post("/signin", signin);

// @route POST /SignoutUser
router.post("/signout", isAuthenticatedUser, signout);

// @route POST /send-mailOtp
router.post("/sendmail", sendmailotp);

// @route POST /forgetPassword
router.post("/forgetpassword", forgetpassword);

// @route POST /reset
router.post("/reset/:id", isAuthenticatedUser, resetpassword);

// @route POST /update
router.post("/update/:id", isAuthenticatedUser, updateuser);

// @route POST /updateAvatar
router.post("/avatar/:id", isAuthenticatedUser, updateavatar);

// ********************************************************************************************


// @route post /resume/create/:userid
router.post("/resume/create/:id", isAuthenticatedUser, createresume);

// @route post /resume/read/:resumeid
router.post("/resume/read/:id", isAuthenticatedUser, readsingleresume);

module.exports = router;
