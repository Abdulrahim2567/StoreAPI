require('dotenv').config()
const connectDB = require('./db/connect')
const productModel = require('./models/product')
const allProducts = require('./products.json')

const uploadProducts = async()=>{
   try {
      await connectDB(process.env.MONGO_URI)
      await productModel.deleteMany()
      await productModel.create(allProducts)
      console.log('OK!')
   } catch (error) {
      console.log(error)
   }
}

uploadProducts()