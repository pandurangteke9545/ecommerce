const mongoose = require('mongoose');
const Order = require('../models/Order');  
const Cart = require('../models/Cart');    
const User = require('../models/User');
const { response } = require('express');

const createOrder = async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(userId) })
                           .populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = new Order({
      user: userId,
      products: cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount: cart.totalAmount
    });

    await order.save();


    // Clear the cart
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await Order.find({ user: new mongoose.Types.ObjectId(userId) })
                              .populate('products.product') 
                              .sort({ createdAt: -1 });   

                              console.log(orders)
                  
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrder = async ({ userId, orderId, transactionId, paymentMethod, paymentStatus }) => {
  if (!orderId || !transactionId || !paymentMethod || !paymentStatus) {
    throw new Error("Missing required payment details");
  }

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found");

  order.status = paymentStatus === 'success' ? 'Placed' : 'cancelled';
  order.paymentDetails = {
    transactionId,
    paymentMethod,
    paymentStatus
  };

  await order.save();
  return order;
};


const updateOrderStatus = async (req, res) => {
  const {orderId,userId,status} = req.body
  console.log(orderId,status,userId)
  if (!orderId || !status ) {
    throw new Error("Missing details");
  }

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found");


  order.status = status
  await order.save();
  res.status(200).json({message:"Order Status Updated"})
  return order;

};


const getAllOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await Order.find().populate('products.product').sort({ createdAt: -1 });   
    console.log(orders)              
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { createOrder, updateOrder,getOrders,getAllOrders,updateOrderStatus };
