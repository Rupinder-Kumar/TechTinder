const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();


requestRouter.post("/sendConnectionRequest", userAuth, async (req,res) => {

});


module.exports = requestRouter;