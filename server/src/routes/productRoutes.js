const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');


router.get('/', productController.getProducts); // GET /api/products
router.post('/addproduct',productController.addProduct)
router.delete('/remove' ,productController.removeProduct)

module.exports = router;

