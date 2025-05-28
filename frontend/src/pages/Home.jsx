import { useEffect, useState } from "react";
import api from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products/")
      .then(res => {
        console.log("Fetched products:", res.data);
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const addToCart = (productId) => {
    api.post("/cart/add", { productId, quantity: 1 })
      .then(() => alert("Added to cart"))
      .catch(err => alert("Login First before add to cart",err ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Our Products</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(product => (
          <div
  key={product._id}
  className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
>
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-48 object-contain bg-white p-2"
  />
  <div className="p-4">
    <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
    <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
    <button
      onClick={() => addToCart(product._id)}
      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
    >
      Add to Cart
    </button>
  </div>
</div>

      
        ))}
      </div>
    </div>
  );
};

export default Home;
