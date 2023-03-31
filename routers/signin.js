const express = require("express");
const { user_model } = require("../mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const signin = express.Router();

function getSignin(req, res) {
  res.render("signin");
}

signin.get("/", getSignin);

async function find(filter) {
  return await user_model.findOne(filter);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await user_model.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
// Define the LocalStrategy

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await user_model.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Define the endpoint
signin.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const alert = ["no user found or incorrect password "];
      //return res.status(401).json({ message: info.message });
      return res.render("signin", {
        alert,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      //return res.status(200).json({ message: "Login successful" });
      return res.redirect("/home");
    });
  })(req, res, next);
});

module.exports = signin;
