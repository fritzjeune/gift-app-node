const express = require("express");
const connectDB = require('./config/db');
const dotenv = require("dotenv");

//load env files 
dotenv.config({ path: '.config/config.env' });

connectDB();



const App = express();

App.get("/", (req, res, next)=>{
    res.send("hello world")
})

App.listen(3000, ()=>{
    console.log("App running on port 3000")
})