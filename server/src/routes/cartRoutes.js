const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addToCart, removeFromCart, getCart,updateCart } = require('../controller/cartContoller');

router.post('/cart/add', auth, addToCart);
router.delete('/cart/remove', auth, removeFromCart);
router.post('/cart/update', auth, updateCart);
router.get('/cart', auth, getCart);

module.exports = router;

