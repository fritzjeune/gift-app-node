const express = require("express");
const connectDB = require('./config/db');
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
// const auth = require("./middlewares/auth");

//load env files 
dotenv.config({ path: '.config/config.env' });

connectDB();

const App = express();

App.use(express.json());

//loading routes
App.use("/apiv1/users", userRouter);
App.use("/apiv1/posts", postRouter);


App.listen(3000, ()=>{
    console.log("App running on port 3000")
})