const Product = require('../models/Product');
const productService = require('../service/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


const addProduct = async (req,res)=>{

  const {name,price,description,type,image} = req.body
  console.log(name,price,description,type,image)

  try {

     await Product.create({name,price,description,type,image})
    res.status(200).json({message:"Product Added"})

    
  } catch (error) {
    res.status(400).json({error:error})
    
  }

}


const removeProduct = async (req, res) => {
  try {
    console.log("In the remover")
    const { productId } = req.body; 
    console.log("Product Id",productId)

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product Removed" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getProducts,
  addProduct,
  removeProduct
};
