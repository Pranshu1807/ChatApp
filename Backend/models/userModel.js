const mongoose = require("mongoose");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"],
    },
    email: {
      type: String,
      required: [true, "Can't be blank"],
      lowercase: true,
      unique: true,
      validate: [isEmail, "invalid email"],
      indx: true,
    },
    password: {
      type: String,
      required: [true, "Can't be blank"],
      minLength: [8, "Password should be atleast 8 characetrs"],
    },
    picture: {
      type: String,
    },
    newMessage: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false }
);
UserSchema.methods.getJWTToken = async function () {
  try {
    let token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
  } catch (e) {
    console.log(e);
  }
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
