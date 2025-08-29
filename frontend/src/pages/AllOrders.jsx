import React, { useEffect, useState } from "react";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  async function fecthAllOrders() {
    const response = await api.get("/orders/getallorder");
    setOrders(response.data.orders);
    setFilteredOrders(response.data.orders);
  }

  async function handleOrderStatus(orderId, userId, status) {
    if (!status) return;
    try {
      await api.post("orders/updateStatus", { orderId, userId, status });
      toast.success(`Order ${status}`);
      fecthAllOrders();
    } catch (err) {
      console.error("Failed to update order:", err);
      toast.error("Something went wrong!");
    }
  }

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFiltered = (status) => {
    setStatusFilter(status);
    if (!status) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.status.toLowerCase() === status.toLowerCase()
      );
      setFilteredOrders(filtered);
    }
  };

  function handleSearch(value) {
    setSearch(value);

    if (value.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const searchOrder = orders.filter((ele) =>
        ele._id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(searchOrder);
    }
  }

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valueA, valueB;
    if (sortConfig.key === "date") {
      valueA = new Date(a.createdAt);
      valueB = new Date(b.createdAt);
    } else if (sortConfig.key === "paymentStatus") {
      valueA = a.paymentDetails?.paymentStatus || "Pending";
      valueB = b.paymentDetails?.paymentStatus || "Pending";
    } else if (sortConfig.key === "status") {
      valueA = a.status || "";
      valueB = b.status || "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    fecthAllOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
        📦 All Orders
      </h1>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="🔍 Search Order Id..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Total Price</th>
              <th
                className="px-4 py-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                Date{" "}
                {sortConfig.key === "date"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>

              <th className="px-4 py-3 text-left">
                <select
                  name="sortOrderStatus"
                  id="sortOrderStatus"
                  value={statusFilter}
                  onChange={(e) => handleFiltered(e.target.value)}
                  className="px-2 py-1 bg-blue-600 text-white  "
                >
                  <option value="">Order Status</option>
                  <option value="Placed">Placed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </th>

              {/* Payment Status Sort */}
              <th
                className="px-4 py-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("paymentStatus")}
              >
                Payment Status{" "}
                {sortConfig.key === "paymentStatus"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>

              <th className="px-4 py-3 text-left">Update Order Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders && sortedOrders.length > 0 ? (
              sortedOrders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 font-mono text-sm">{order._id}</td>
                  <td className="px-4 py-3">{order.user}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3">
                    {order.paymentDetails?.paymentStatus || "Pending"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      name="orderStatus"
                      onChange={(e) =>
                        handleOrderStatus(order._id, order.user, e.target.value)
                      }
                      className="px-2 py-1  rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Update Order</option>
                      <option value="Placed">Placed</option>
                      <option value="Picked">Picked</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  ❌ No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default AllOrders;

