const mongoose = require('mongoose');
const Order = require('../models/Order');  // Fixed import: Order model
const Cart = require('../models/Cart');    // Fixed import: Cart model

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


const updateOrder = async (req, res) => {
  const userId = req.user.userId;
  const { orderId, transactionId, paymentMethod, paymentStatus } = req.body;

  if (!orderId || !transactionId || !paymentMethod || !paymentStatus) {
    return res.status(400).json({ message: "Missing required payment details" });
  }

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = paymentStatus === 'success' ? 'paid' : 'failed';
    order.paymentDetails = {
      transactionId,
      paymentMethod,
      paymentStatus
    };

    await order.save();
    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, updateOrder };
