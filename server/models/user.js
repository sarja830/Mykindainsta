//schemas or blueprint  of the whole db

const mongoose = require('mongoose')
const {ObjectId} =mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },pic:{
        type:String,
        default:"https://res.cloudinary.com/sarthjain830/image/upload/v1593938055/sample.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)


//after creating a model u have to register in app.js
