const express = require('express');
const cartrouter = express.Router();
const auth = require('../middleware/authMiddleware');
const { addToCart, removeFromCart, getCart,updateCart } = require('../controller/cartContoller');

cartrouter.post('/cart/add', auth, addToCart);
cartrouter.delete('/cart/remove', auth, removeFromCart);
cartrouter.post('/cart/update', auth, updateCart);
cartrouter.get('/cart', auth, getCart);

module.exports = cartrouter;

