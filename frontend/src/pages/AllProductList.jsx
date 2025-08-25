

import React from 'react'
import api from '../api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function AllProductList() {

    const [products, setProducts] = useState([]);
      const [loading , setLoading] = useState(false);
       const navigate = useNavigate();
    
      useEffect(() => {
        setLoading(true)
        api.get("/products")
          .then(res => {
            console.log("Fetched products:", res.data);
            if (Array.isArray(res.data)) {
              console.log(res.data);
              setProducts(res.data);
            } else if (Array.isArray(res.data.products)) {
              setProducts(res.data.products);
            } else {
              console.error("Unexpected response structure:", res.data);
            }
          })
          .catch(err => console.error("Error fetching products:", err)).finally(setLoading(false));
      }, []);


     async function addProduct(){
        console.log("Clicked")
            navigate("/addproduct")
     }

async function removeProduct(productId) {
  const confirmdelete = window.confirm("Are sure to remove this product")
  if(!confirmdelete){
    return
  }
  try {
    const response = await api.delete("/products/remove", {
      data: { productId: productId }
    });

    toast.success("Product Removed");

    // ✅ Update UI immediately
    setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));

  } catch (error) {
    console.error("Error removing product:", error);
    toast.error("Failed to remove product");
  }
}

 return (
    <div className="p-6 flex flex-col items-center">
    <div className='flex justify-around items-center  w-full'>
    <h1 className="m-5 text-3xl font-bold text-blue-600" >All Products</h1>
  
  <button className='p-2 rounded-xl  mr-0 bg-blue-700 text-white hover:bg-pink-500' onClick={addProduct}>Add New Product</button>
  </div>

  <div className="w-full max-w-6xl shadow-lg rounded-2xl overflow-x-auto">
    <table className="border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden ">
      <thead className="bg-blue-600 text-white dark:bg-blue-700">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Remove</th>
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((prod, index) => (
            <tr
              key={prod._id}
              className={`₹{
                index % 2 === 0
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800"
              } hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors`}
            >
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                {prod._id}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-16 h-16 object-cover rounded-lg shadow"
                />
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                {prod.name}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                ₹{prod.price}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                {prod.type}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600 max-w-xs truncate">
                {prod.description}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                {new Date(prod.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                {prod?.quantity || 1}
              </td>
              <td className="px-6 py-3 text-sm border-b dark:border-gray-600">
                <button
                  onClick={() => removeProduct(prod._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition duration-200"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" className="text-center py-6 text-gray-500">
              No Products Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  <ToastContainer
  
  autoClose = "1000"

  />
</div>
  );
}

export default AllProductList
