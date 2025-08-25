import React, { useEffect, useState } from "react";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState(""); 
  const [search , setSearch] = useState("")

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
      alert("Something went wrong while updating order!");
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
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <input type="text" placeholder="Search Order Id" value={search} onChange={(e)=>handleSearch(e.target.value)}/>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Total Price</th>
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date{" "}
              {sortConfig.key === "date"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>

            {/* ✅ Dropdown Filter */}
            <th className="border px-4 py-2 cursor-pointer">
              <select
                name="sortOrderStatus"
                id="sortOrderStatus"
                value={statusFilter}
                onChange={(e) => handleFiltered(e.target.value)}
                className="p-1 border rounded text-white"
              >
                <option className="p-1 border rounded text-black" value="">Order Status</option>
                <option  className="p-1 border rounded text-black" value="Placed">Placed</option>
                <option className="p-1 border rounded text-black" value="Delivered">Delivered</option>
                <option className="p-1 border rounded text-black" value="Cancelled">Cancelled</option>
                <option className="p-1 border rounded text-black" value="Pending">Pending</option>
              </select>
            </th>

            {/* ✅ Sortable Payment */}
            <th
              className="border px-4 py-2 cursor-pointer"
              onClick={() => handleSort("paymentStatus")}
            >
              Payment Status{" "}
              {sortConfig.key === "paymentStatus"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>

            <th className="border px-4 py-2">Update Order Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders && sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{order.user}</td>
                <td className="border px-4 py-2">₹{order.totalAmount}</td>
                <td className="border px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  {order.paymentDetails?.paymentStatus || "Pending"}
                </td>
                <td className="border px-4 py-2">
                  <select
                    name="orderStatus"
                    onChange={(e) =>
                      handleOrderStatus(order._id, order.user, e.target.value)
                    }
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
              <td colSpan="7" className="text-center py-4">
                No Orders Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default AllOrders;
