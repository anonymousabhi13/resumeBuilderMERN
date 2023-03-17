const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

exports.sendmail = catchAsyncErrors(async (user, res, next) => {
  const otp = Math.floor(Math.random() * (10000 - 1000) + 1000);
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "Email",
      pass: "Password",
    },
  });

  const mailOptions = {
    from: "Resume Builder<resume.builder@temp.in>",
    to: user.email,
    subject: "Password Reset OTP code",
    text: "Do not share this code to anyone.",
    html: `<p>Do not share this code to anyone.</p><h1>${otp}</h1>`,
  };

  await transport.sendMail(mailOptions, async (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));
    user.otp = otp;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Mail Sent, check inbox/span" });
  });
});
