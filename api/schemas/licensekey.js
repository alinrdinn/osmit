var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LicenseKey = new Schema({
  license_keys_counter: {
    type: Number,
    required: true
  },
  active_license_keys: {
    type: [Number],
    required: true
  }
});

module.exports = mongoose.model("LicenseKey", LicenseKey);
