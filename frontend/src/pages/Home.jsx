import { useEffect, useState } from "react";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); // ✅ for categories
  const [sortOrder, setSortOrder] = useState(""); // ✅ for price sorting

  const navigate = useNavigate()
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
      .finally(() => setLoading(false)); // ✅ fixed finally
  }, []);

  // ✅ Handle category checkbox toggle
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // remove if already selected
        : [...prev, category] // add if not selected
    );
  };

  const addToCart = (productId) => {
    api
      .post("/cart/add", { productId, quantity: 1 })
      .then(() => toast.success("Added To Cart"))
      .catch((err) => {toast.error("Please Login", err)
        setTimeout(()=>{ navigate("/signin")},1500)
   
        
    }
    );
  };

  // ✅ Apply filters
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      selectedCategories.length > 0
        ? selectedCategories.includes(p.type?.toLowerCase()) // assume product has `category`
        : true
    )
    .sort((a, b) => {
      if (sortOrder === "lowtohigh") return a.price - b.price;
      if (sortOrder === "hightolow") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <h1 className="flex font-bold text-4xl justify-center items-center">
        Loading...
      </h1>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ✅ Search bar top center */}
      <div className="flex justify-center mb-6 ">
        <input
          className="w-1/2 bg-blue-200 rounded-xl p-3"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ Main grid: sidebar + products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar: categories + sorting */}
        <div className="md:col-span-1 bg-gray-100 rounded-xl p-4 h-fit">
          <h2 className="font-bold text-lg mb-3">Categories</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes("electronics")}
                onChange={() => handleCategoryChange("electronics")}
              />
              Electronics
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes("fashion")}
                onChange={() => handleCategoryChange("fashion")}
              />
              Fashion
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes("home")}
                onChange={() => handleCategoryChange("home")}
              />
              Home
            </label>
          </div>

          {/* Sorting */}
          <h2 className="font-bold text-lg mt-6 mb-2">Sort by Price</h2>
          <select
            className="w-full p-2 border rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Select</option>
            <option value="lowtohigh">Low → High</option>
            <option value="hightolow">High → Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3 grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
          {filteredProducts.map((product) => (
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
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  ₹{product.price}
                </p>
                <button
                  onClick={() => addToCart(product._id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-900 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add to Cart
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
