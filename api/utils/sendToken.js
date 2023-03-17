exports.sendtoken = (user, statusCode, res) => {
    const token = user.getjwttoken();

    const options = {
        expires: new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        // secure: true
    };

    res.status(statusCode).cookie("token", token, options).json({
        succerss: true,
        id: user._id,
        token,
    });
};
