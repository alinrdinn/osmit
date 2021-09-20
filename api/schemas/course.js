var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Course = new Schema({
  course_type: {
    type: String,
    required: true
  },
  course_name: {
    type: String,
    required: true
  },
  course_desc: {
    type: String,
    required: false
  },
  for_premium: {
    type: Boolean,
    required: true
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Course", Course);
