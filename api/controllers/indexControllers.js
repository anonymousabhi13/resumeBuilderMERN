const userModel = require("../models/userModel");
const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const { sendtoken } = require("../utils/sendtoken");
const { sendmail } = require("../utils/sendoptmail");
const ErrorHandler = require("../utils/ErrorHandler");
const ImageKit = require("../utils/imageKit");
const resumeModel=require("../models/resumeModel")

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
exports.resetpassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel
    .findById(req.params.id)
    .select("+password")
    .exec();
  const isMatch = user.comparepassword(req.body.oldpassword);
  if (!isMatch) return next(new ErrorHandler("Old Password is incorrect", 401));

  user.password = req.body.newpassword;
  await user.save();
  res.json({ message: "Password Changed Successfully", success: true });
});

exports.updateuser = catchAsyncErrors(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.params.id, req.body).exec();
  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});
exports.updateavatar = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).exec();
  const file = req.files.avatar;
  const filename = `resumebuilder-${user._id}-${Date.now()}-${file.name}`;
  if (user.file.avatar != "") {
    await ImageKit.deleteFile(user.avatar.fileId);
  }
  const { fileId, url } = await ImageKit.uploadFile(file.data, filename);
  user.avatar = { fileId, url };
  await user.save();
  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});


exports.createresume = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).exec();
  const newresume = new resumeModel(req.body);
  console.log(req.body);
  user.resumes.push(newresume._id);
  newresume.personalinfo = user._id;
  res.status(201).json({ success: true, message: "New resume created" });
});

exports.readsingleresume = catchAsyncErrors(async (req, res, next) => {
  const resume = await resumeModel.findById(req.params.id)
    .populate("personalinfo")
    .exec();
  res.status(200).json({ success: true, resume });
});