const passport = require('passport');
const LocalStrategy = require('passport-local');
const model = require("../models")


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',    
  },(email, password, done) => {
    const { users : User } = model
  User.findOne({ where : {email}, include:"groups"  })
    .then((user) => {                
      if(!user || !user.verifyPassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(done);
}));