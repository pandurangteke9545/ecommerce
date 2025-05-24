
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    console.log("Incoming productId:", productId);

    // ✅ Works for both ObjectId and string _id
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      console.error("Product not found in DB:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
        totalAmount: product.price * quantity
      });
    } else {
      const existingProduct = cart.products.find(
        p => p.product.toString() === productId.toString()
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      // Recalculate total
      cart.totalAmount = 0;
      for (let item of cart.products) {
        const prod = await Product.findOne({ _id: item.product.toString() });
        if (prod) {
          cart.totalAmount += prod.price * item.quantity;
        }
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).json({ message: err.message });
  }
};


// Remove product from cart
const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  
  const { productId } = req.body;  

  // console.log("This is the product which i want to remove from cart",productId)

  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Recalculate total
    cart.totalAmount = 0;
    for (let item of cart.products) {
      const prod = await Product.findById(item.product);
      if (prod) {
        cart.totalAmount += prod.price * item.quantity;
      }
    }

    await cart.save();
    res.json({ message: "Product removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// update cart 
const updateCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number" || quantity < 1) {
    return res.status(400).json({ message: "Valid productId and quantity are required" });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productInCart = cart.products.find(p => p.product.toString() === productId);
    if (!productInCart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    productInCart.quantity = quantity;

    // Recalculate total
    cart.totalAmount = 0;
    for (let item of cart.products) {
      const prod = await Product.findById(item.product);
      if (prod) {
        cart.totalAmount += prod.price * item.quantity;
      }
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get cart
const getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  updateCart
};
