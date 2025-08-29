import { useEffect, useState } from "react";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/products/")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const addToCart = (productId) => {
    api
      .post("/cart/add", { productId, quantity: 1 })
      .then(() => toast.success("Added To Cart"))
      .catch(() => {
        toast.error("Please Login");
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      });
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedCategories.length > 0
        ? selectedCategories.includes(p.type?.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortOrder === "lowtohigh") return a.price - b.price;
      if (sortOrder === "hightolow") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <h1 className="flex font-bold text-4xl justify-center items-center h-screen">
        Loading...
      </h1>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ✅ Sticky Search Bar */}
      <div className="sticky top-26 z-10 bg-white/80 backdrop-blur-md shadow-md py-4 flex justify-center mb-6 rounded-xl">
        <input
          className="w-1/2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full px-5 py-3 outline-none focus:ring-4 focus:ring-blue-400 transition-all"
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ Main grid: sidebar + products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar (Sticky) */}
        <div className="md:col-span-1 sticky top-50 self-start bg-white shadow-lg rounded-xl p-5 border border-gray-200">
          <h2 className="font-extrabold text-xl text-blue-700 mb-4">
            Categories
          </h2>
          <div className="space-y-3 text-gray-700">
            <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedCategories.includes("electronics")}
                onChange={() => handleCategoryChange("electronics")}
              />
              Electronics
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedCategories.includes("fashion")}
                onChange={() => handleCategoryChange("fashion")}
              />
              Fashion
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedCategories.includes("home")}
                onChange={() => handleCategoryChange("home")}
              />
              Home
            </label>
          </div>

          {/* Sorting */}
          <h2 className="font-extrabold text-xl text-blue-700 mt-6 mb-3">
            Sort by Price
          </h2>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Select</option>
            <option value="lowtohigh">Low → High</option>
            <option value="hightolow">High → Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-contain bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-t-2xl"
              />
              {/* Flex container to keep button at bottom */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-extrabold text-blue-600 mt-3">
                    ₹{product.price}
                  </p>
                </div>
                <button
                  onClick={() => addToCart(product._id)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default Home;
