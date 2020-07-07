const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')



//Connection to MongoDB
mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})
mongoose.connection.on('error', (error) => {
    console.log(`error connecting to mongo ${error}`)
})


require('./models/user')
require('./models/post')


// express.json() 
//This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
//it should be used before 
//   app.use(require('./routes/auth')) or any other import like this order is extremely important
app.use(express.json())


app.use(require('./routes/auth'))
app.use(require('./routes/user'))
app.use(require('./routes/post'))

app.listen(PORT, () => {
    console.log(`server is on on localhost ${PORT}`)
})








//MIDDLE WARE TUTORIAL BASICS 
// //to use the middleware everywhere
// //app.use(customMiddleware)

// const customMiddleware = (req,res,next)=>{
//     console.log("middleware executed")
//    next()
// }



// app.get('/',(req,res)=>{
//     console.log("home")
//     res.send("helllo world")
// })


// //to use only for a specific request
// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("about")
//     res.send("about world")
// })