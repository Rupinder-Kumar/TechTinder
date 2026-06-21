const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

// Signup API for creating user
authRouter.post("/signup", async (req, res) => {

  try {
    const { firstName, lastName, emailId, password } = req.body;

    // validating user input
    validateSignUpData(req);

    // Encrypt the password   
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName, 
      lastName, 
      emailId, 
      password: passwordHash
    });

    const response = await user.save();

    res.status(201).json({
      message: "User added successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

//Login API
authRouter.post("/login", async (req,res) => {
      try {

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if(!user) {
          throw new Error("Invalid Credentials!");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid) {

          const token = await user.getJWT();

          // create a JWT token
          // add token to cookie and send the response back to the user
          res.cookie("token",token, { httpOnly: true, expires: new Date(Date.now() + 24 * 36000)});

          res.status(200).send(user);

        } else {
          throw new Error("Invalid Credentials!");
        }

      } catch(err) {
        res.status(400).json({
        message: err.message
    });
  }
});

//Logout API
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!");
})

module.exports = authRouter