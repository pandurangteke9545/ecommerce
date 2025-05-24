const productService = require('../service/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

module.exports = {
  getProducts
};
