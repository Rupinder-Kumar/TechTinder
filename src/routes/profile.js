const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
   } catch(err) {
        res.status(400).json({
        message: err.message
    });
  }
});   

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)) {
        throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
   
    res.status(200).json({message: `${loggedInUser.firstName} your profile has been updated successfuly`});

   } catch(err) {
        res.status(400).json({
        message: err.message
    });
  }
});   

module.exports = profileRouter;