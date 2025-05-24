import { useEffect, useState } from "react";
import api from "../api/api"; // your axios instance
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  // const navigate = useNavigate();

  // Fetch cart details from backend
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

  // Remove product from cart
 const removeFromCart = async (productId) => {
  console.log("I am in te remove item from cart")
  try {
    console.log(productId)
    await api.delete("cart/remove",{ data: { productId } });  // productId here should be string like "6826d45949c402f0a6a6dfdb"
    fetchCart(); // reload cart after removal
  } catch (err) {
    console.log("i am in error part");
    alert("Failed to remove item");
  }
};


  // Update product quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // prevent quantity < 1
    try {
      await api.post("/cart/update", { productId, quantity });
      fetchCart(); // refresh cart after update
    } catch (err) {
      alert("Failed to update quantity");
      console.error("Update error:", err.response || err.message);
    }
  };

  // Place order handler
 const handleCreateOrder = async () => {
  try {
    // Step 1: Create order
    const res = await api.post("/orders/create");
    const order = res.data.order;

    const txnid = "txn_" + new Date().getTime(); // unique transaction id

    // Step 2: Initiate PayU payment
    const payuRes = await api.post("/payu/initiate", {
      txnid,
      amount: order.totalAmount,
      firstname: "John",
      email: "john@example.com",
      phone: "9876543210",
      productinfo: "Mobile Purchase",
      surl: "http://localhost:5000/api/payu/success",
      furl: "http://localhost:5000/api/payu/failure",

    });

    const { action, params } = payuRes.data;

    // Step 3: Auto-submit form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;

    for (let key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  } catch (err) {
    console.error("Order/payment failed:", err.response?.data || err.message);
    alert("Something went wrong during payment.");
  }
};


  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

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
                    <p className="text-gray-700">${product.price.toFixed(2)}</p>
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
            <div className="text-xl font-semibold">Total: ${total.toFixed(2)}</div>
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

