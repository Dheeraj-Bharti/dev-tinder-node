const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

// Get all pending connection requests for the user
userRouter.get('/user/request/received',userAuth, async (req, res) => {

    try {
         const loggedInUserId = req.user;

         const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId._id,
            status: "interested" // Assuming 'pending' is the status for received requests
        })
        .populate('fromUserId', 'firstName lastName photoUrl about skills') // Populate fromUserId with user details
        .exec();

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching connection requests",
            error: error.message
        });
    }
});


userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId._id, status: "accepted" },
                { toUserId: loggedInUserId._id, status: "accepted" }
            ]
        }).populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA)

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === loggedInUserId._id.toString()) {
                return {
                    ...row.toUserId._doc,
                    status: row.status
                };}
                return {
                    ...row.fromUserId._doc,
                    status: row.status
                };
            
        })

        res.json({
            message: "Connections fetched successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching connections",
            error: error.message
        });
    }
});

// Feed api

userRouter.get('/feed', userAuth, async (req, res) => {
    try {

        // user should see all user cards except
        //  his own
        // his connections
        // ignored cards
        // already sent connection requests

        const loggedInUserId = req.user;
        // all connecction requests sent or received

        // pagination
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit; // Calculate the number of items to skip




        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId._id },
                { toUserId: loggedInUserId._id }
            ]
        }).select('fromUserId toUserId')
            .populate('fromUserId', 'firstName')
            .populate('toUserId', 'firstName ')

            const hideUserFromFeed = new Set();
        connections.forEach(req => {
           hideUserFromFeed.add(req.fromUserId._id.toString());
           hideUserFromFeed.add(req.toUserId._id.toString()); 
        });
        console.log(hideUserFromFeed);
        

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUserId._id } }, // Exclude the logged-in user
                { _id: { $nin: Array.from(hideUserFromFeed) } } // Exclude connections
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

       
        res.json({
            message: "Feed fetched successfully",
            data: users
        });

        
    } catch (error) {
        res.status(400).json({
            message: "Error fetching feed",
            error: error.message
        });
    }
});




module.exports = userRouter