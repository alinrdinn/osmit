var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var User = new Schema({
  name: {
    type: String
  },
  premium_till: {
    type: Date
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
