const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (validator.isStrongPassword(password)) {
    throw new Error("please enter a strong passsowrd");
  }
};

const validateEditProfileData = (req) => {
  const allowededitFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skils",
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    allowededitFields.includes(key)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData
};
