const express = require('express');
const { createOrder,updateOrder,getOrders, getAllOrders,updateOrderStatus } = require('../controller/orderController');
const authMiddleware = require('../middleware/authMiddleware'); // if using auth
const orderrouter = express.Router();

orderrouter.post('/create', authMiddleware, createOrder);
orderrouter.post('/update', authMiddleware, updateOrder);
orderrouter.post('/updateStatus', authMiddleware,updateOrderStatus );
orderrouter.get('/get', authMiddleware,getOrders);
orderrouter.get('/getallorder',authMiddleware,getAllOrders)


module.exports = orderrouter;
