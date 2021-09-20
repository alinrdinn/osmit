const { encode, decode } = require("universal-base64url");
const createHmac = require("create-hmac");
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var passport = require("passport");
var User = require("../schemas/user");
var LicenseKey = require("../schemas/licensekey");
var authenticate = require("../authenticate");
const cors = require("./cors");
var mongoose = require("mongoose");

const config = require("../config");
router.use(bodyParser.json());

/* GET users listing. */
router
  .route("/signup")
  .options(cors.corsWithOptions, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .post(cors.cors, (req, res, next) => {
    User.register(
      new User({
        username: req.body.username,
        name: req.body.name,
        premium_till: new Date()
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        } else {
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        }
      }
    );
  });

router
  .route("/login")
  .options(cors.corsWithOptions, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .post(cors.cors, passport.authenticate("local"), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!"
    });
  });

router
  .route("/data")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      data: req.user,
      status: "Get User Data Successful!"
    });
  });

router
  .route("/changedata")
  .options(cors.corsWithOptions, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    var update_query = {};
    if (req.body.hasOwnProperty("name")) {
      update_query.name = req.body.name;
    }
    // if (req.body.hasOwnProperty("username")) {
    //   update_query.username = req.body.username;
    // }
    if (!Object.keys(update_query).length) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: "Change Data Unsuccessful!"
      });
      return;
    }
    User.findOneAndUpdate({ _id: req.user._id }, { name: req.body.name })
      .then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Change Data Successful!"
        });
      })
      .catch((err) => next(err));
  });

router
  .route("/changepassword")
  .options(cors.corsWithOptions, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
      if (err) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Change Password Unsuccessful!"
        });
      } else if (user) {
        user
          .changePassword(req.body.old_password, req.body.new_password)
          .then((result) => {
            return result.save();
          })
          .then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              data: result,
              status: "Get User Data Successful!"
            });
          })
          .catch((err) => next(err));
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Change Password Unsuccessful!"
        });
      }
    });
  });

router
  .route("/logout")
  .options(cors.corsWithOptions, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // mongoose.disconnect();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      status: "Logout Successful!"
    });
  });

router
  .route("/upgrade")
  .options(cors.corsWithOptions, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendStatus(200);
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    const key_payload = req.body.key.split(".")[0];
    const payload = JSON.parse(decode(key_payload));
    if (payload.plan && payload.order_number) {
      const key_header = config.key_header_license;
      const hmac = createHmac("sha256", config.secretKey);
      hmac.update(key_header + "." + key_payload);
      const signature = encode(hmac.digest());
      const key_payload_signature = key_payload + "." + signature;
      if (req.body.key !== key_payload_signature) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Upgrade Unsuccessful!"
        });
        return;
      }
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: "Upgrade Unsuccessful!"
      });
      return;
    }
    LicenseKey.findOne({})
      .then((respond) => {
        if (payload.order_number in respond.active_license_keys) {
          return LicenseKey.findOneAndUpdate(
            { _id: respond._id },
            { $pull: { active_license_keys: payload.order_number } },
            { new: true }
          );
        }
      })
      .then((respond) => {
        var premium = new Date();
        premium.setMonth(premium.getMonth() + payload.plan);
        return User.findOneAndUpdate(
          { _id: req.user._id },
          { premium_till: premium }
        );
      })
      .then((respond) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Upgrade Successful!"
        });
      })
      .catch((err) => next(err));
  });
module.exports = router;
