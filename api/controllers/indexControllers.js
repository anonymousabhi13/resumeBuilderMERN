const userModel = require("../models/userModel");
const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const { sendtoken } = require("../utils/sendtoken");
const { sendmail } = require("../utils/sendoptmail");
const ErrorHandler = require("../utils/ErrorHandler");

exports.homepage = (req, res, next) => {
  res.json({ message: "Homepage" });
};

exports.getloggedInuser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  console.log(user);
  res.json({
    message: "hehe",
    data: user,
    success: true,
  });
});

exports.signupuser = catchAsyncErrors(async (req, res, next) => {
  // res.json({message:"hehe",data:req.body})
  console.log(req.body);
  const user = await new userModel(req.body).save();
  sendtoken(user, 201, res);
});

exports.signin = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!user) return next(new ErrorHandler("Invalid email or password", 401));
  const ispasswordcorrect = await user.comparepassword(req.body.password);
  if (!ispasswordcorrect)
    return next(new ErrorHandler("Invalid email or password", 401));
  sendtoken(user, 200, res);
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  //this is okay but we dont know whose token to be deleted so we will use the
  //  below method like we will verify the token first and then take the response
  // and remove the token

  console.log("logged out");
  res.json({ message: "Successfully signout!" });
});

exports.sendmailotp = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!user) return next(new ErrorHandler("Invalid email or password", 401));
  sendmail(user, res, next);
});
exports.forgetpassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!user) return next(new ErrorHandler("User not Found", 404));
  if (user.otp != req.body.otp)
    return next(new ErrorHandler("Invalid OTP", 401));
  user.password = req.body.password;
  await user.save();
  res.json({ message: "Password Changed Successfully", success: true });
});
