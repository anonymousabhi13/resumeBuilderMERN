const mongoose = require("mongoose");
exports.databaseconnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/resumebuilderonline");
    console.log("database connected!");
  } catch (error) {
    console.log("database disconnected!");

    console.log(error.message);
  }
};
