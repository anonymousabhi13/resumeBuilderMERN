exports.createErrors = function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  if (err.name === "TokenExpiredError") {
    err.message = "Session timeout, Login again!";
  }

  if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key")
  ) {
    err.message = "User already exists";
  }
  res.status(statusCode).json({
    message: err.message,
    errName: err.name,
  });
};
