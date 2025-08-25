import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const profile = useContext(ProfileContext)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [navOpen , setNavOpen] = useState(false)

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
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const confirmed = window.confirm("Do you want to Logout?");
    if (!confirmed) {
      return; 
    }
      await api.post(
        "/auth/logout", 
        {},
        { withCredentials: true}
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
    {isLoggedIn && profile?.roll == "admin" ?
     (<Link 
    className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
    to="/admin"
  >
    Home
  </Link>
)  :(
  
  <Link 
    className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
    to="/"
  >
    Home
  </Link>
)
  }
     
    {isLoggedIn && profile?.roll == "user" && (
      <>
      <Link 
        className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
        to="/orders"
        >
        My Orders
      </Link>

      <Link 
      className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" 
      to="/cart"
      >
      Cart
    </Link>
      </>
    )}
     {isLoggedIn && profile?.roll=="admin" && (
      <>
        <Link className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" to={"/allorders"} 
        onClick={setNavOpen}
        >
        All Orders</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" to={"/customers"}>
        Customer</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300" to={"/allproducts"}>
        All Products</Link>
      </>
     )}
  </div>

  <div>
    {isLoggedIn ? (
        <div className="relative">
          <img
            src={profile?.image}
            alt="User"
            className="w-12 h-12 rounded-full cursor-pointer border-2 border-purple-600"
            onClick={() => {
              setOpen(true); 
              setTimeout(() => {
                setOpen(false); 
              }, 2000);

            }}
          />
          <p className="text-center">{profile?.name}</p>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
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

