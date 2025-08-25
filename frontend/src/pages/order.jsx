import { useEffect, useState } from "react";
import api from "../api/api"; // axios instance with token attached

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/get"); // GET /orders (authenticated)
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
  }, []);

  if (loading) return <div className="text-center mt-10 text-4xl font-bold">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm flex justify-between"
          > <div>
            <div className="mb-2">
              <span className="font-semibold">Order ID:</span> {order._id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Amount:</span> ₹{order.totalAmount}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Products:</span>
              <ul className="list-disc ml-6 mt-2">
                {order.products.map((item, index) => (
                  <li key={index}>
                    {item.product?.name || "Product deleted"} - Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            </div>
                
            <div>
                <h1> <span className="font-semibold">Payment :-</span> {order.paymentDetails?.paymentStatus ?? "pending"}</h1>
                <h1><span className="font-semibold">Order Status :-</span> {order.status}</h1>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
