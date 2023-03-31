const express = require("express");
const { user_model } = require("../mongoose");
const { body, validationResult } = require("express-validator");

const register = express.Router();

function getRegister(req, res) {
  res.render("register");
}

async function find(filter) {
  return user_model.findOne(filter);
}

register.get("/", getRegister);

register.post(
  "/",
  [
    body("name").trim().isLength(4).withMessage("must be min of 4 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("email must be a vaild email")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(6)
      .withMessage("password must be of length 6"),
    body("conform-password").custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error(" Password do not matches ");
      }
      return true;
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      //console.log(alert);
      res.render("register", {
        alert,
      });
    } else {
      const email = req.body.email;
      const user = await find({ email });

      if (!user) {
        const new_user = new user_model({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        new_user.save();
      }

      res.redirect("/");
    }
  }
);

module.exports = register;
