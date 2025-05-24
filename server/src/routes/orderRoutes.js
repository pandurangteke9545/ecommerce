// routes/orderRoutes.js
const express = require('express');
const { createOrder,updateOrder } = require('../controller/orderController');
const authMiddleware = require('../middleware/authMiddleware'); // if using auth
const router = express.Router();

router.post('/create', authMiddleware, createOrder);
router.post('/update', authMiddleware, updateOrder);


module.exports = router;
