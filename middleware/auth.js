//auth,isStudent,isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  //here we will pass 3 parameters coz after one middleware called next should call
  try {
    //extract or fetch jwt token which is in body or in cookies
    // const token=req.body.token

    //pass token through cookies or request hwader its high secure
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    //if token not found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    //now next is to varify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);

      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong , while verifying token",
    });
  }
};

//For student
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for student",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

//For admid

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};
