const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    // Read token from req cookies
    try {
        const {token} = req.cookies;

        if(!token) {
            return res.status(401).send("Unauthorized Access! Please login to continue.");
        }

    // validate the token
        const decodedObj = await jwt.verify(token,"tech@tinder$790");
        // find the user
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if(!user) {
          throw new Error("User does not exist!")
        }
        req.user = user;
        next()

        } catch(err) {
            res.status(400).send("ERROR:" + err.message);
        }

}

module.exports = {
    userAuth,
}