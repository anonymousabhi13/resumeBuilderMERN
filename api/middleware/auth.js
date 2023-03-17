const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(
            new ErrorHandler("Please login to access the resource", 401)
        );
    }
    const { id } = jwt.verify(token, "secret");
    req.id = id;
    next();
});
