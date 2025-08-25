const express = require("express");
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();


//profile
profileRouter.get("/profile",userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      res.status(400).send("error: " + error);
    }
  });


profileRouter.patch("/profile/edit",userAuth, async (req, res) => {
    try {
      if(!validateEditProfileData(req)) {
       return res.status(400).send("Invalid fields in request body"); 
      }
      const loggedInUser = req.user;

     Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          loggedInUser[key] = req.body[key];
        }
      })
       await loggedInUser.save();

  res.json({message:`Profile updated successfully!${loggedInUser.firstName} ${loggedInUser.lastName}`,
    data: loggedInUser});
    } catch (error) {
      res.status(400).send("error: " + error);
    }
  });

  profileRouter.patch("profile/password", userAuth, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = req.user;

      if (!oldPassword || !newPassword) {
        return res.status(400).send("Old password and new password are required");
      }

      // Check if the old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).send("Old password is incorrect");
      }

      // Update the password
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password updated successfully!" });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  });

  module.exports = profileRouter;
