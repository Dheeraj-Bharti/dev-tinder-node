const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("",authRouter);
app.use("",profileRouter);
app.use("",requestRouter);
app.use("",userRouter);

connectDB()
  .then(() => {
    console.log("DB connection success");
    app.listen(7777, () => {
      console.log("server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("DB connection not success");
  });
