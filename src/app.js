const express = require("express");
const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");


app.post("/signup", async (req, res) => {

  try {
    const user = new User({
      firstName: "Rupinder",
      lastName: "Kumar",
      emailId: "rupinder3972@gmail.com",
      password: "Rupi@123",
      age: 35,
      gender: "M"
    });

    const response = await user.save();

    res.status(201).json({
      message: "User added successfully",
      data: response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
});

connectDB().then(() => {
    console.log("Database connection established....");
    app.listen(8080, () => {
        console.log("Server is successfully listening on port 8080.....");
    });

}).catch(err => {
        console.error("Database cannot be connected..."+ err);
})


