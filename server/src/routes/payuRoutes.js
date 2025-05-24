// routes/orderRoutes.js
const express = require('express');
const {initiatePayU,handlePayUSuccess,handlePayUFailure} = require('../controller/paymentController');
const authMiddleware = require('../middleware/authMiddleware'); // if using auth
const router = express.Router();

router.post('/initiate', authMiddleware, initiatePayU);
router.post('/success', handlePayUSuccess);
router.post('/failure',  handlePayUFailure);




module.exports = router;
