const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"], 
         message: "{VALUE} is not a valid"
      }
       
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "data:image/jpeg;base64,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",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$123", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwodHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwodHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
