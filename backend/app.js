const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require("morgan") // Middleware library to print http requests
const mongoose = require('mongoose')
const productsRouter = require('./routers/products')
const categoryRouter = require('./routers/categories')
const userRouter = require('./routers/users')
const orderRouter = require('./routers/orders')
const authJwt = require('./helpers/jwt')
// const errorHandler = require('./helpers/error-handler')
// const cors = require('cors')
require('dotenv/config') // use specific contsatnt to get value from the end file
const api = process.env.API_URL

// Enable Cors
// app.use(cors)
// app.options('*',cors())

// // Middelware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt())
// app.use(errorHandler())
app.use((err,req,res,next)=>{
    if(err){
        res.status(500).send("Error on the server " + err.name)
    }
})

//Routes
app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categoryRouter);
app.use(`${api}/users`,userRouter);
app.use(`${api}/orders`,orderRouter);


// Database Connection
mongoose.connect(process.env.CONNECTION_STRING,{ useUnifiedTopology: true,useNewUrlParser : true, dbName: 'eshop-database',  useFindAndModify: false})
.then(()=>{
    console.log("database connection is ready")
})
.catch((err)=>{
    console.log(err)
})


// Serveur launching
app.listen(3000,()=>{
    // Successful creation of the server
    console.log("the server is running")
})