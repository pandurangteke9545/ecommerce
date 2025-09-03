import { useEffect, useState } from "react";
import api from "../api/api"; 
import { io } from "socket.io-client";


const url = import.meta.env.VITE_BASE_URL
console.log(url)
const socket = io("https://ecommerce-hq8o.onrender.com", {
  transports: ["websocket", "polling"]
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/get"); 
      setOrders(res.data.orders);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for live order updates
    socket.on("orderStatusUpdate", ({ orderId, status }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    return () => {
      socket.off("orderStatusUpdate");
    };
  }, []);

  if (loading) return <div className="text-center mt-10 text-2xl font-bold text-gray-700">⏳ Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4">
                <div className="mb-3 md:mb-0">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      order.paymentDetails?.paymentStatus === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Payment: {order.paymentDetails?.paymentStatus ?? "Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      order.status === "Delivered"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Status: {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-green-700">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-800">Products:</span>
                  <ul className="mt-2 space-y-2">
                    {order.products.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-gray-700">
                          {item.product?.name || "❌ Product removed"}
                        </span>
                        <span className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

