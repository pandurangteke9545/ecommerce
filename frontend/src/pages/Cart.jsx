import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Enabled
import api from "../api/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate(); // ✅ Navigation hook

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
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.post("/cart/update", { productId, quantity });
      fetchCart(); // refresh cart after update
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const handleCreateOrder = async () => {
    try {
      console.log("near order")
      const res = await api.post("/orders/create");
      
      const order = res.data.order;
      console.log("Order pass",order)

      const payuRes = await api.post("/payu/start-payment", {
        amount: parseFloat(order.totalAmount).toFixed(2),
        orderid: order._id,
        userid: order.user,
      });

      const params = payuRes.data;
      const requiredFields = [
        "key", "txnid", "amount", "productinfo",
        "firstname", "email", "phone", "surl", "furl", "hash"
      ];

      for (const field of requiredFields) {
        if (!params[field]) {
          alert("Payment parameters are incomplete. Please try again.");
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
      alert("Payment initiation failed.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with title and Get Orders button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Cart</h2>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cartItems.length === 0 && !error ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="flex items-center justify-between border rounded p-4 shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-700">₹{product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="ml-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end items-center gap-6">
            <div className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</div>
            <button
              onClick={handleCreateOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
            >
              Proceed to Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
