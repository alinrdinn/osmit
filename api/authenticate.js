var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./schemas/user");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

var config = require("./config.js");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(jwt_payload._id)
        }
      },
      {
        $project: {
          _id: 1,
          name: {
            $split: ["$name", " "]
          },
          premium: {
            status: {
              $gte: [
                {
                  $subtract: ["$premium_till", new Date()]
                },
                0
              ]
            },
            till: {
              $dateToString: {
                date: "$premium_till",
                format: "%Y-%m-%d"
              }
            }
          }
        }
      }
    ])
      .exec()
      .then((user) => {
        if (user) {
          return done(null, user[0]);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        if (err) {
          return done(err, false);
        }
      });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
