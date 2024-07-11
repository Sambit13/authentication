const express = require('express');
const router= express.Router();



const {login,signup}= require("../Controllers/Auth");

//Now we have to check aythentication and authorization
const{auth,isStudent,isAdmin}=require("../middleware/auth");  

router.post("/login",login);
router.post("/signup",signup);

//For testing
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for test"
    })
})

//Protected routes for authentication and authorization
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for student"
    })
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for admin"
    })
})

module.exports= router;