import { useEffect, useState } from "react";
import api from "../api/api";
import { Trash2, Plus, Minus } from "lucide-react"; // ✅ icons
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const { products, totalAmount } = res.data;

      setCartItems(products || []);
      setTotal(totalAmount || 0);
      setError("");
    } catch (err) {
      console.error("Fetch cart failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete("cart/remove", { data: { productId } });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.post("/cart/update", { productId, quantity });
      fetchCart();
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleCreateOrder = async () => {
    try {
      const res = await api.post("/orders/create");
      const order = res.data.order;

      const payuRes = await api.post("/payu/start-payment", {
        amount: parseFloat(order.totalAmount).toFixed(2),
        orderid: order._id,
        userid: order.user,
      });

      const params = payuRes.data;
      const requiredFields = [
        "key",
        "txnid",
        "amount",
        "productinfo",
        "firstname",
        "email",
        "phone",
        "surl",
        "furl",
        "hash",
      ];

      for (const field of requiredFields) {
        if (!params[field]) {
          toast.error("Payment parameters incomplete. Try again.");
          return;
        }
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://test.payu.in/_payment";
      form.style.display = "none";

      for (const key in params) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error("Payment initiation failed.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cartItems.length === 0 && !error ? (
        <div className="text-center py-16 bg-blue-100 rounded-xl shadow-inner">
          <p className="text-black font-bold text-lg">Buy Something!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain bg-gray-50 p-2 rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="flex items-center gap-3">
                  {/* Wrap + - qty in responsive flex-col */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="p-2 rounded-full border hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="p-2 rounded-full border hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove button stays separate */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="ml-2 sm:ml-6 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 h-fit">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Order Summary
            </h3>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCreateOrder}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default Cart;
