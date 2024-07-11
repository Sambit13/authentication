const express = require('express');
const app=express();

//Import dotenv
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(express.json());

//install import cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

require("./config/database").connect();

//Then import Route and mount
const user= require("./routes/user");
app.use("/api/v1",user);

//Activate App
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})