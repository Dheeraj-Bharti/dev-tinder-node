const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided: Please login again.");
    }
    const decodedObj = await jwt.verify(token, "DEV@Tinder$123");

    // Validate the token
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    // find user
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: "+ error.message);
  }
};

module.exports = {
  userAuth,
};
