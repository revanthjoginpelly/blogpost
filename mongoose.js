require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const config = {
  Mongo_URl: process.env.Mongo_URl,
};

user_info = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

user_info.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});
user_info.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const user_model = mongoose.model("User", user_info);

async function connect_mongodb() {
  await mongoose.connect(config.Mongo_URl);
}

mongoose.connection.once("open", () => {
  console.log(" database connected");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

module.exports = {
  user_model,
  connect_mongodb,
};
