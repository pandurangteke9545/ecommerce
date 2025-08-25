import React, { useEffect, useState } from "react";
import api from "../api/api"; // adjust the path if needed

function AdminHome() {
  const [orders, setOrders] = useState([]);

  async function fetchAllOrders() {
    try {
      const response = await api.get("/orders/getallorder");
      console.log(response.data.orders);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Count orders by status
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const deliveredOrders = orders.filter(order => order.status === "Delivered").length;
  const cancelledOrders = orders.filter(order => order.status === "cancelled").length;
  const pickedOrders = orders.filter(order => order.status === "Picked").length;
  const placedOrders = orders.filter(order => order.status === "Placed").length;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-12 mt-8 text-center text-blue-900">Welcome to Admin Page</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-200 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl">Total Orders</h2>
          <p className="text-xl">{totalOrders}</p>
        </div>

        <div className="p-4 bg-pink-200 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl">Pending Orders</h2>
          <p className="text-xl">{pendingOrders}</p>
        </div>

        <div className="p-4 bg-green-200 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl">Delivered Orders</h2>
          <p className="text-xl">{deliveredOrders}</p>
        </div>

        <div className="p-4 bg-red-200 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl">Cancelled Orders</h2>
          <p className="text-xl">{cancelledOrders}</p>
        </div>

        <div className="p-4 bg-purple-200 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl">Picked Orders</h2>
          <p className="text-xl">{pickedOrders}</p>
        </div>

        <div className="p-4 bg-orange-200 rounded-xl shadow-md text-center">
          <h2 className="font-bold text-xl">Placed Orders</h2>
          <p className="text-xl">{placedOrders}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
