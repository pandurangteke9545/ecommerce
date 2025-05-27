import { useEffect, useState } from "react";
import api from "../api/api"; // your axios instance
// import { useNavigate } from "react-router-dom";

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
    console.log("i am in error part",err);
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

    console.log("OrderData :-", order);

    // const txnid = "txn_" + new Date().getTime(); // unique transaction ID

    console.log("👉 Initiating payment...");

    // Step 2: Call backend to get PayU payment parameters
    const payuRes = await api.post("/start-payment", {
      amount: parseFloat(order.totalAmount).toFixed(2), // ensure valid string like "500.00"
      // name: "John", // Consider getting this from user profile
      // email: "john@example.com", // Consider getting this from user profile
      orderid: order._id,
      userid: order.user
    });

    const params = payuRes.data;
    console.log("✅ PayU Params Received:", params);

    // Step 3: Validate required fields
    const requiredFields = [
      "key", "txnid", "amount", "productinfo",
      "firstname", "email", "phone", "surl", "furl", "hash"
    ];

    for (const field of requiredFields) {
      if (!params[field]) {
        console.error(`❌ Missing PayU param: ${field}`);
        alert("Payment parameters are incomplete. Please try again.");
        return;
      }
    }

    // Step 4: Create and submit the form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://test.payu.in/_payment"; // Change to production URL when live
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
    console.error("❌ Payment initiation failed:", err.response?.data || err.message);
    alert("Payment initiation failed. Check console for details.");
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

