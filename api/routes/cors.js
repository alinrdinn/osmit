const express = require("express");
const cors = require("cors");

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log(req.header("Origin"));
  if (req.header("Origin") === "https://osmitapp.com") {
    corsOptions = {
      origin: true
    };
  } else {
    corsOptions = {
      origin: false
    };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
