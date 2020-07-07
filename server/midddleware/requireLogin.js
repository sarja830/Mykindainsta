const jwt= require('jsonwebtoken')
const {JWT_SECRET}= require('../keys')
const mongoose= require('mongoose')
const User= mongoose.model("User")


module.exports = (req,res,next)=>{
   //we are providing in header Authorization field Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjAwYWMyZjdhZDMwYjM0ODk1ZjFkMmMiLCJpYXQiOjE1OTM4Nzk2MjB9.boFbPm8OZZ7at3TH2xVOKneEwLUxnM8Wiky6ejyJbsA
   //to remove Bearer and space function is written
    const {authorization} =req.headers
    
    //authorization === Bearer ashfjuihjbug
    if(!authorization){
     return  res.status(401).json({error:"you must be logged in"})
    }
   const token= authorization.replace("Bearer ","")

   jwt.verify(token,JWT_SECRET,(err,payload)=>{
       if(err){
           return res.status(401).json({error:"you must be logged in"})
       }

       const {_id} =payload;
       User.findById(_id)
       .then(userdata=>{
           req.user =userdata
           next()
       })
      
   })

}