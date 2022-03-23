require('dotenv').config()
//errors
require('express-async-errors')

const express = require('express')
const app = express()
//router
const productsRouter = require('./routes/products')
//DB
const mongoDB = require('./db/connect')
//not found
const notFoundMiddleWare = require('./middleware/not-found')
//error middleWare 
const errorMiddleWare = require('./middleware/error-handler')

//use json
app.use(express.json())
//route
app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleWare)
app.use(errorMiddleWare)

const port = process.env.PORT || 3000
const spinServer = async ()=>{
   try {
      //connectDB
      await mongoDB(process.env.MONGO_URI)
      app.listen(port, console.log(`Server is listening on port ${port}...`))
   } catch (error) {
      console.log(error)
   }
}
spinServer()
