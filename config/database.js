const mongoose = require('mongoose');

require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{console.log("DB connected successfully")})
    .catch((err)=>{
        console.log("Error connecting to Mongo");
        console.error(err);
        process.exit(1); // very important line (if any error came it automatically came out from DB)
    })
}

