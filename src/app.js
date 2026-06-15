const express = require("express");
const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());


// Feed API - fetching all users from users collection 
app.get("/feed", async (req, res) => {
  
  try {

   const users = await User.find({});
  
    if (users.length === 0) {
      res.status(404).send("Users not found");
    }

    res.status(200).send(users);

  } catch(err) {
    res.status(400).send("Something went wrong"+ err);
    console.error(err);
  }

});

//  User API - fetching specific user from users collection 
app.get("/user", async (req, res) => {
  
  try {
  
    const userEmailId = req.body.emailId;
    const user = await User.findOne({ emailId: userEmailId });
  
    if (!user || user.length === 0) {
      res.status(404).send("User not found");
    }

    res.status(200).send(user);

  } catch(err) {
     res.status(400).json({
      message: err.message
    });
    console.error(err);
  }

});

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

// Delete API - deleting user from users collection
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.status(200).send("User Deleted Successfully")
  } catch(err) {
     res.status(500).json({
      message: err.message
    });
    console.error(err);
  }
});

// Update API - Updating user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body

  try {
    const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    
    if(!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if(data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10!");
    }
    
    const user = await User.findByIdAndUpdate({_id: userId}, data, {
        returnDocument:"before",
        runValidators: true,
      });

    res.status(200).send("User Updated Successfully" + user);

  } catch(err) {
     res.status(400).json({
      message: err.message
    });
    console.error(err);
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


