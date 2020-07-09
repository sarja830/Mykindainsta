

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../midddleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')



const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))





// router.get('/protected',requireLogin,(req,res)=>{

//     res.send("hello user")
// })


// router.get('/', (req, res) => {
//     res.send("hello")
// })

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body

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
                                to: user.email,
                                from: "sarthjain830@gmail.com",
                                subject: "signup success",
                                html: "<h1>Welcome to Mykindainsta</h1><p>Hope you like the app</p>"
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

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password" })
            }

            bcrypt.compare(password, savedUser.password)
                .then(domatch => {

                    if (domatch) {
                        // res.json({message:"Succesfuly signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } })
                    }
                    else { return res.status(422).json({ error: "Invalid email or password" }) }
                }).
                catch(err => {
                    console.log(err)
                })

        })
})

router.post('/reset-password', (req, res) => {
    
//as soon as he got the email a token is geneerated using crypto inbuilt in node

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        //convrted to hex
        const token = buffer.toString("hex")

        //then search wether the email is registered or not  
        User.findOne({ email: req.body.email })

        //if found a user then set values for reset token in user schema and send an expiry date as well and after that an email is sent 
        //it will send the link as reset/tokenid which will be routed to newPassword from routes section in front end bcoz user will click on it
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User doesnt exist with that email" })
                }
                user.resetToken = token
                //1hr in millisec
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({

                        to: user.email,
                        from: "sarthjain830@gmail.com",
                        subject: "Password reset for Mykindainsta",
                        html: `<p>you are recieving this because you have requested for a password reset</p><br/><h5>click on the link  to reset your password <a href="http://localhost:3000/reset/${token}">password reset link</a></h5>`
                    })
                    res.json({ message: "check your email" })
                }
                )
            })

    })
})



router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sendToken = req.body.token
    //gt is to check for date of expire greater than
    User.findOne({resetToken:sendToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user)
        {
                return res.status(422).json({error:"Link expired try again later"})

        }
                bcrypt.hash(newPassword,12)
                .then(hashedPassword=>{
                    user.password = hashedPassword
                    user.resetToken=undefined
                    user.expireToken=undefined
                    user.save().then((savedUser)=>{
                        res.json({message:"password updated"})
                    })

                })
        
    })
    .catch(err=>{
            console.lg(err)
    })
})

module.exports = router