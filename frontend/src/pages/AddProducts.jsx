import React, { useState } from 'react';
import api from '../api/api';

function AddProducts() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    type: "",
    image: ""
  });

  // handle change for all inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // handle form submission
 async function handleSubmit(e) {
  e.preventDefault();

  try {
    console.log("Product submitted:", product);

    const response = await api.post("/products/addproduct", {
      name: product.name,
      price: product.price,
      description: product.description,
      type: product.type,
      image: product.image
    });

    console.log("Response:", response.data);

    // ✅ show success message
    alert("Product added successfully!");

    // reset form
    setProduct({
      name: "",
      price: "",
      description: "",
      type: "",
      image: ""
    });

  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Try again.");
  }
}


  return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🛍️ Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            name="price"
            placeholder="Enter product price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="description"
            placeholder="Enter product description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="type"
            placeholder="Enter product type"
            value={product.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="image"
            placeholder="Enter product image URL"
            value={product.image}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {product.image && (
            <div className="flex justify-center">
              <img
                src={product.image}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
          >
            ➕ Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;
