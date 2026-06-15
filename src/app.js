const express = require("express");
const connectDB = require("./config/database");

const app = express();
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cookieParser());


// Signup API for creating user
app.post("/signup", async (req, res) => {

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
      data: response
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message
    });
  }
});

//Login API

app.post("/login", async (req,res) => {
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

          res.status(200).send("Login Successful!!");

        } else {
          throw new Error("Invalid Credentials!");
        }

      } catch(err) {
        res.status(400).json({
        message: err.message
    });
    console.error(err);
  }
})


app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
   } catch(err) {
        res.status(400).json({
        message: err.message
    });
    console.error(err);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req,res) => {

});

connectDB().then(() => {
    console.log("Database connection established....");
    app.listen(8080, () => {
        console.log("Server is successfully listening on port 8080.....");
    });

}).catch(err => {
        console.error("Database cannot be connected..."+ err);
})


