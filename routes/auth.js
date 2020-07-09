

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET }=require('../config/keys')
const requireLogin = require('../midddleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')




const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))





// router.get('/protected',requireLogin,(req,res)=>{
    
//     res.send("hello user")
// })


// router.get('/', (req, res) => {
//     res.send("hello")
// })

router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body

    if (!email || !password || !name) {

        //.status(422) if anything is not present it returns with a status code of 200 which is not good
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already registered" })
            }

            //before putting in db hashing password
            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic
                    })

                    user.save()
                        .then(user => {
                             transporter.sendMail({
                    to:user.email,
                    from:"sarthjain830@gmail.com",
                    subject:"signup success",
                    html:"<h1>Welcome to Mykindainsta</h1><p>Hope you like the app</p>"
                })
                          
                           
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }).catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
     return   res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser)
        {
            return  res.status(422).json({error:"Invalid email or password"})
        }

        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{

            if(domatch)
            {
                // res.json({message:"Succesfuly signed in"})
                const token= jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id ,name,email,followers,following,pic }=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else
           { return  res.status(422).json({error:"Invalid email or password"})}
        }).
        catch(err=>{
            console.log(err)
        })
        
    })
})




module.exports = router