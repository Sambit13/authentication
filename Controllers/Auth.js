const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup route handler

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Secure Password (here we will use bcrypt)
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
            // hash(password, number of rounds to hash) //syntax for hash function
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing password',
            });
        }

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // If signup successfully done
        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot register, please try again later",
        });
    }
};

//Login Route Handler

exports.login = async (req,res)=>{
    try{
        //data fetch
    const{email,password}=req.body;

    //Validate Email and password(if data is not in email box and password box)
    if(!email || !password) {
        return res.status(400).json({
            success:false,
            message:"Please enter your details carefully",
        })
    }

    //Check for registered user (User avaleble or not)
    let user = await User.findOne({email}); //If anything we will check from dataBase we will use await
    
    //If not a registered user
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User is not registered",
        })
    }


    const payload ={
        email:user.email,
        id:user._id,
        role:user.role,
    }
        //Veryfy Password and generate JWT token (Very important)
        if(await bcrypt.compare(password,user.password)) {  // it will comapre password inside      database and password entered is same or not
            let token=jwt.sign(payload,
                               process.env.JWT_SECRET,
                            {
                                expiresIn:"2h",
                            })
            
            user=user.toObject();
            user.token=token;
            user.password=undefined; //coz we will send entire user object as response so hacker will know the password thats why we will remove password from user object

            //After creating token directly we can share through response to client but if we send with cookie it will be good practice
            const options={
                expires: new Date(Date.now() + 3* 24 * 60 * 60 *1000 ), //day*hour*min*sec*milsec
                httpOnly:true,
            }

            //Cookie syntax
            //cookie(cookie_name, cookie_data, Options)
            res.cookie("sonu",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User loggedin successfully",
            })
        }

        
        else{
            //If password do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            })
        }



}
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure"
        });
    }
}
