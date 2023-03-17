const ImageKit = require("imagekit");
exports.intitImagekit = () => {
  var imagekit = new ImageKit({
    publicKey: "",
    privateKey: "",
    urlEndpoint: "",
  });
  return imagekit;
};
