const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const {userAuth} = require("../middlewares/auth")
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    // password encrypt
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
      const token = await savedUser.getJWT();
  
        res.cookie("token", token,{
          expires: new Date(Date.now() + 8*360000),
        });
    res.json({ message: "User added successfully", data: savedUser });
  } catch (error) {
    res.status(400).send("error while sending the user: " + error);
  }
});

authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId: emailId });
      if (!user) throw new Error("Invalid credentials");
  
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
  
        const token = await user.getJWT();
  
        res.cookie("token", token);
        res.send(user);
      } else throw new Error("Invalid credentials");
    } catch (error) {
      res.status(400).send("error: " + error);
    }
  });
  

  authRouter.post("/logout", userAuth, (req, res) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.send("Logout successful");
    } catch (error) {
      res.status(500).send("Error during logout: " + error);
    }
  });

module.exports = authRouter;