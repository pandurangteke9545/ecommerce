const Product = require('../models/Product');

const getAllProducts = async () => {
  return await Product.find(); // You can add filters or sort if needed
};

module.exports = {
  getAllProducts
};
