const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"];
const MAX_QUERY_LIMIT = 100;


// Get all pending connection requests for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
        try {

            const loggedInUser = req.user;

            const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId", USER_SAFE_DATA);

            res.status(200).json({ message: "Data Fetched successfuly", data: connectionRequests })

        } catch (err) {
             res.status(400).send("ERROR:" + err.message);
        }
});

// Get all connections for logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
        try {

            const loggedInUser = req.user;
            const connectionRequests = await ConnectionRequest.find({
                $or: [
                    { toUserId: loggedInUser._id, status: "accepted" },
                    { fromUserId: loggedInUser._id, status: "accepted" }
                ]
            })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);
            const data = connectionRequests.filter((row) => row.fromUserId !== null).map((row) => {
                if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return row.toUserId;
                }
                return row.fromUserId;
            });

            res.status(200).json({message: "Fetched Connections!", data})
        } catch (err) {
             res.status(400).send("ERROR:" + err.message);
        }
});


// Feed API for getting feed of users on the application
userRouter.get("/feed", userAuth, async (req, res) => {
        try {

            // user should be able to see all users except:
            // his own
            // his connections
            // ignored people
            // already sent connection request
            const loggedInUser = req.user;
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = limit > MAX_QUERY_LIMIT ? MAX_QUERY_LIMIT : limit;
            const skip = (page - 1) * limit;

            // find all connection requests
            const connectionRequests = await ConnectionRequest.find({
                $or:[
                    {fromUserId: loggedInUser._id},
                    {toUserId: loggedInUser._id},
                ]
            }).select("fromUserId toUserId");

            const hideUsersFromFeed = new Set();

            connectionRequests.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            });

            const users = await User.find({ 
                $and: [
                    {_id: {$nin: Array.from(hideUsersFromFeed)}},
                    {_id: {$ne: loggedInUser._id}}
                ]
            }).select(USER_SAFE_DATA.join(" ")).skip(skip).limit(limit);
           
            res.status(200).json({message: "Fetched Users feed!", data: users})
        } catch (err) {
             res.status(400).send("ERROR:" + err.message);
        }
});

module.exports = userRouter;