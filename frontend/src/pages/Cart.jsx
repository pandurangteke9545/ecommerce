import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const { products, totalAmount } = res.data;
      setCartItems(products || []);
      setTotal(totalAmount || 0);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete("cart/remove", { data: { productId } });
      fetchCart();
    } catch {
      alert("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.post("/cart/update", { productId, quantity });
      fetchCart();
    } catch {
      alert("Failed to update quantity");
    }
  };

  const handleCreateOrder = async () => {
    try {
      const res = await api.post("/orders/create");
      const order = res.data.order;

      const payuRes = await api.post("/start-payment", {
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
    } catch {
      alert("Payment initiation failed.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Your Cart</h2>
        <button
          onClick={() => navigate("/orders")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          Get Orders
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cartItems.length === 0 && !error ? (
  <p>Your cart is empty.</p>
) : (
  <>
    <div className="space-y-4 sm:space-y-6">
      {cartItems.map(({ product, quantity }) => (
        <div
          key={product._id}
          className="flex flex-col md:flex-row items-start md:items-center justify-between border rounded p-4 shadow gap-6"
        >
          {/* Product Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-3/5">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded"
            />
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-700">${product.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-end gap-3 w-full md:w-2/5">
            <div className="flex items-center gap-2">
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
            </div>

            {/* Make sure Remove button wraps properly on mobile */}
            <div className="w-full sm:w-auto text-center">
              <button
                onClick={() => removeFromCart(product._id)}
                className="mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  



          {/* Total & Checkout */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl font-semibold">
              Total: ${total.toFixed(2)}
            </div>
            <button
              onClick={handleCreateOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold w-full sm:w-auto"
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





// import { useEffect, useState } from "react";
// import api from "../api/api"; // your axios instance
// // import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [error, setError] = useState("");
//   const [total, setTotal] = useState(0);
//   // const navigate = useNavigate();

//   // Fetch cart details from backend
//   const fetchCart = async () => {
//     try {
//       const res = await api.get("/cart");
//       const { products, totalAmount } = res.data;

//       setCartItems(products || []);
//       setTotal(totalAmount || 0);
//       setError("");
//     } catch (err) {
//       console.error("Fetch cart failed:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to load cart");
//     }
//   };

//   // Remove product from cart
//  const removeFromCart = async (productId) => {
//   console.log("I am in te remove item from cart")
//   try {
//     console.log(productId)
//     await api.delete("cart/remove",{ data: { productId } });  // productId here should be string like "6826d45949c402f0a6a6dfdb"
//     fetchCart(); // reload cart after removal
//   } catch (err) {
//     console.log("i am in error part",err);
//     alert("Failed to remove item");
//   }
// };


//   // Update product quantity
//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return; // prevent quantity < 1
//     try {
//       await api.post("/cart/update", { productId, quantity });
//       fetchCart(); // refresh cart after update
//     } catch (err) {
//       alert("Failed to update quantity");
//       console.error("Update error:", err.response || err.message);
//     }
//   };

//   // Place order handler
//  const handleCreateOrder = async () => {
//   try {
//     // Step 1: Create order
//     const res = await api.post("/orders/create");
//     const order = res.data.order;

//     console.log("OrderData :-", order);

//     // const txnid = "txn_" + new Date().getTime(); // unique transaction ID

//     console.log("👉 Initiating payment...");

//     // Step 2: Call backend to get PayU payment parameters
//     const payuRes = await api.post("/start-payment", {
//       amount: parseFloat(order.totalAmount).toFixed(2), // ensure valid string like "500.00"
//       // name: "John", // Consider getting this from user profile
//       // email: "john@example.com", // Consider getting this from user profile
//       orderid: order._id,
//       userid: order.user
//     });

//     const params = payuRes.data;
//     console.log("✅ PayU Params Received:", params);

//     // Step 3: Validate required fields
//     const requiredFields = [
//       "key", "txnid", "amount", "productinfo",
//       "firstname", "email", "phone", "surl", "furl", "hash"
//     ];

//     for (const field of requiredFields) {
//       if (!params[field]) {
//         console.error(`❌ Missing PayU param: ${field}`);
//         alert("Payment parameters are incomplete. Please try again.");
//         return;
//       }
//     }

//     // Step 4: Create and submit the form
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "https://test.payu.in/_payment"; // Change to production URL when live
//     form.style.display = "none";

//     for (const key in params) {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = params[key];
//       form.appendChild(input);
//     }

//     document.body.appendChild(form);
//     form.submit();
//   } catch (err) {
//     console.error("❌ Payment initiation failed:", err.response?.data || err.message);
//     alert("Payment initiation failed. Check console for details.");
//   }
// };





//   useEffect(() => {
//     fetchCart();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       {cartItems.length === 0 && !error ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="space-y-6">
//             {cartItems.map(({ product, quantity }) => (
//               <div
//                 key={product._id}
//                 className="flex items-center justify-between border rounded p-4 shadow"
//               >
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-24 h-24 object-cover rounded"
//                   />
//                   <div>
//                     <h3 className="font-semibold text-lg">{product.name}</h3>
//                     <p className="text-gray-700">${product.price.toFixed(2)}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => updateQuantity(product._id, quantity - 1)}
//                     className="px-3 py-1 border rounded hover:bg-gray-200"
//                   >
//                     −
//                   </button>
//                   <span className="w-8 text-center">{quantity}</span>
//                   <button
//                     onClick={() => updateQuantity(product._id, quantity + 1)}
//                     className="px-3 py-1 border rounded hover:bg-gray-200"
//                   >
//                     +
//                   </button>
//                   <button
//                     onClick={() => removeFromCart(product._id)}
//                     className="ml-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 flex justify-end items-center gap-6">
//             <div className="text-xl font-semibold">Total: ${total.toFixed(2)}</div>
//             <button
//               onClick={handleCreateOrder}
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
//             >
//               Proceed to Order
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;



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
      const res = await api.post("/orders/create");
      const order = res.data.order;

      const payuRes = await api.post("/start-payment", {
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
        <button
          onClick={() => navigate("/orders")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Orders
        </button>
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
