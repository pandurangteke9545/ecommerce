import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Trash2 } from "lucide-react"; // icons

function AllProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/products")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  async function addProduct() {
    navigate("/addproduct");
  }

  async function removeProduct(productId) {
    const confirmDelete = window.confirm("Are you sure you want to remove this product?");
    if (!confirmDelete) return;

    try {
      await api.delete("/products/remove", { data: { productId } });
      toast.success("Product Removed");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      toast.error("Failed to remove product");
    }
  }

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">📦 All Products</h1>
        <button
          onClick={addProduct}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

 
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white ">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-sm font-semibold">Quantity</th>
                <th className="px-6 py-3 text-sm font-semibold">Created</th>
                <th className="px-6 py-3 text-sm font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products && products.length > 0 ? (
                products.map((prod, index) => (
                  <tr
                    key={prod._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                    } hover:bg-blue-50 dark:hover:bg-gray-600 transition`}
                  >
                    <td className="px-6 py-3 border-b">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 object-cover rounded-lg shadow"
                      />
                    </td>
                    <td className="px-6 py-3 border-b font-medium">{prod.name}</td>
                    <td className="px-6 py-3 border-b text-green-600 font-semibold">
                      ₹{prod.price}
                    </td>
                    <td className="px-6 py-3 border-b">{prod.type}</td>
                    <td className="px-6 py-3 border-b max-w-xs truncate">{prod.description}</td>
                    <td className="px-6 py-3 border-b">{prod.quantity || 1}</td>
                    <td className="px-6 py-3 border-b text-sm text-gray-500">
                      {new Date(prod.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <button
                        onClick={() => removeProduct(prod._id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default AllProductList;
 