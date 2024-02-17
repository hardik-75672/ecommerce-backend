const { Product } = require("../model/product")

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProduct=async (req,  res)=>{
  console.log("product" + req.user)
    let product=Product.find({});
    let totalProductsQuery = Product.find({});
    if(req.query.category){
            product= product.find({category:req.query.category})
            totalProductsQuery = totalProductsQuery.find({
              category: req.query.category,
            });
    }
    
    //  console.log(req.query)
    
    if(req.query.brand){
            product= product.find({brand:req.query.brand})
            totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
    }
    if(req.query._sort && req.query._order){
      product= product.sort({[req.query._sort]:req.query._order})
    }

    const totalDocs = await totalProductsQuery.count().exec();

     if(req.query._page && req.query._limit){
        const pageSize=req.query._limit;
        const page=req.query._page;
        product=product.skip(pageSize*(page-1)).limit(pageSize)
     }
    try{
        const doc=await product.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(201).json(doc);
    }catch (err){
        res.status(400).json(err);
    }

}

exports.fetchProductById = async (req, res) => {
  const  id  = req.params._id;
// console.log(id)
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const  id  = req.params._id;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};