const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const secret = require("../config/jwtConfig").secret;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;
const model = require("../models");

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  const { User } = model;
 
  User.findOne({ where: { email: jwt_payload.email }, include:"channels" })
    .then(user => {
      return done(null, user);
    })
    .catch(() => {
      return done(null, false);
    });
});
