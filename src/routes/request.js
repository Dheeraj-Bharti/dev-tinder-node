const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type",
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      // Check if the connection request already exists
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error sending connection request",
        error: error.message,
      });
    }

    // res.send("sendConnectionRequest")
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;

      const { status, requestId } = req.params;

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested", // Only interested requests can be accepted or rejected
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();

      res.json({
        message: `Connection request ${status}`,
        data: updatedRequest,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error processing connection request",
        error: error.message,
      });
    }
  }
);

module.exports = requestRouter;
