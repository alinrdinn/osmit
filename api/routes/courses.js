var fs = require("fs");
var path = require("path");
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var Course = require("../schemas/course");
var authenticate = require("../authenticate");
const cors = require("./cors");

const config = require("../config");
router.use(bodyParser.json());

router
  .route("/data")
  .options(cors.cors, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Course.find()
      .then((results) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          data: results,
          status: "Successful Get Data!",
          success: true
        });
      })
      .catch((err) => next(err));
  });

router
  .route("/data/:filename")
  .options(cors.cors, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    var data;
    fs.readFile(
      path.join(__dirname, "private") +
        "/courses/" +
        req.params.filename +
        ".json",
      "utf8",
      function (err, result) {
        if (err) next(err);
        data = JSON.parse(result);
        if (data.premium === true) {
          if (!req.user.premium.status) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              status: "Usuccessful Get Data!",
              success: false
            });
            return;
          }
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          status: "Successful Get Data!",
          data: data.data,
          success: true
        });
      }
    );
  });
module.exports = router;
