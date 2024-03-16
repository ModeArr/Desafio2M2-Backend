const passport = require("passport");
const local = require("passport-local");
const DBUserManager = require("../dao/DBUserManager");
const userModel = require("../dao/models/user.models");
const userManager = new DBUserManager()



const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {

        const { first_name, last_name, email } = req.body;

        try {
          let user = await userManager.checkUser(email)
          if (user) {
            return done(null, false);
          }

          const newUser = await userManager.addUser(first_name, last_name, email, password)

          if (!newUser) {
            return res
              .status(500)
              .json({ message: `we have some issues register this user` });
          }

          return done(null, newUser);
        } catch (error) {
            throw Error(error)
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          let user = await userManager.checkUserAndPass(username, password)
          console.log(user)
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    //let user = await userManager.checkUserID(user._id);
    done(null, user);
  });
};

module.exports = initializePassport;