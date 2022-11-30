const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { validate } = require("./models/account");

const AccountModel = require("./models/account");

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    AccountModel.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!validPassword(user, password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    });

    async function validPassword(user, password) {
      return await bcrypt.compare(user.password, password);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));

  passport.serializeUser((user, done) => done(null, user.username));

  passport.deserializeUser((username, done) => {
    AccountModel.findOne({ username: username }, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
