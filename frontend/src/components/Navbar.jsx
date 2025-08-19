import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("authChange", checkLoginStatus);
    return () => {
      window.removeEventListener("authChange", checkLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout", 
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Cookie clearing failed:", err);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/signin");
  };


  function handleLogin(){
     
      navigate("/signin")
  }

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg sticky  top-0">
  <Link to="/" className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-300">OnlineMart</Link>
  <div className="space-x-6 flex justify-center items-center text-lg">
    <Link 
      className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
      to="/"
    >
      Home
    </Link>
    <Link 
      className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
      to="/cart"
    >
      Cart
    </Link>
    {isLoggedIn && (
      <Link 
        className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
        to="/orders"
      >
        My Orders
      </Link>
    )}
  </div>

  <div>
    {isLoggedIn ? (
      <button 
        onClick={handleLogout} 
        className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-200 transition duration-300"
      >
        Logout
      </button>
    ) : (
      <button 
        onClick={handleLogin} 
        className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-200 transition duration-300"
      >
        Login
      </button>
    )}
  </div>
</nav>
  );
};

export default Navbar;

