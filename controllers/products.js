const productModel = require('../models/product')
const getAllProducts = async (req, res)=>{
   const {featured, company, name, sort, fields, numericFilters} = req.query
   const queryObj = {}
   if(featured){
      queryObj.featured = featured === 'true' ? true:false
   }
   if(company){
      queryObj.company = company
   }
   if(name){
      queryObj.name = {$regex: name, $options: 'i'}
   }
   let result= productModel.find()
   //sort
   if(sort){
      const sortList = sort.split(',').join(' ')
      result = result.sort(sortList)
   }
   //fields
   if(fields){
      const fieldsList = fields.split(',').join(' ')
      result = result.select(fieldsList)
   }
   //pagination
   const page = Number(req.query.page) || 1
   const limit = Number(req.query.limit) || 10
   const skip = (page - 1) * limit
   result = result.skip(skip).limit(limit)
   //numericFilters
   if(numericFilters){
      const operatorMap = {
         '<':'$lt',
         '<=':'$lte',
         '=':'$eq',
         '>':'$gt',
         '>=':'$gte',
      }
      let regEx = /\b(<|<=|=|>|>=)\b/g
      let filters = numericFilters.replace(regEx,(match)=> `-${operatorMap[match]}-`)
      const options = ['price', 'rating']
      filters.split(',').forEach(item => {
         const [field, operator, value] = item.split('-')
         if(options.includes(field)){
            queryObj[field] = {[operator]:Number(value)}
         }
      })
   }
   
   //final result
   console.log(queryObj)
   let results = result.find(queryObj)
   const products = await results
   res.status(200).json({nbHits:products.length, products})
}

module.exports = {getAllProducts}