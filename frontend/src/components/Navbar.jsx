import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/api";
import { ProfileContext } from "../context/ProfileContext";
import { Menu, X } from "lucide-react";
import logo from "../assets/onlinemart.jpeg"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {profile} = useContext(ProfileContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const confirmed = window.confirm("Do you want to Logout?");
      if (!confirmed) return;

      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Cookie clearing failed:", err);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/signin");
  };

  const handleLogin = () => navigate("/signin");

  const navLink =
    "px-3 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300";

  return (
    <nav className="flex justify-between h-26 items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      

          <Link className="" to="/">
            <img src={logo} alt="Online Mart" className="p-3 h-25"  />
          </Link>
        

      <div className="hidden md:flex space-x-6 text-lg items-center">
        {isLoggedIn && profile?.roll === "admin" ? (
          <Link className={navLink} to="/admin">
            Home
          </Link>
        ) : (
          <Link className={navLink} to="/">
            Home
          </Link>
        )}

        {isLoggedIn && profile?.roll === "user" && (
          <>
            <Link className={navLink} to="/orders">
              My Orders
            </Link>
            <Link className={navLink} to="/cart">
              Cart
            </Link>
          </>
        )}

        {isLoggedIn && profile?.roll === "admin" && (
          <>
            <Link className={navLink} to="/allorders">
              All Orders
            </Link>
            <Link className={navLink} to="/customers">
              Customer
            </Link>
            <Link className={navLink} to="/allproducts">
              All Products
            </Link>
          </>
        )}
      </div>

      {/* Profile / Login */}
      <div className="flex items-center space-x-4 ">
        {isLoggedIn ? (
        <div className="relative">
          <img
            src={profile?.image}
            alt="User"
            className="w-12 h-12 rounded-full cursor-pointer border-2 border-purple-600 "
            onClick={() => {
              setOpen(true); 
              setTimeout(() => {
                setOpen(false); 
              }, 2000);

            }}
          />
          <p className="text-center">{profile?.name}</p>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 shadow-lg rounded-lg overflow-hidden z-100">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-purple-100 z-100"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 z-100"
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

        <button
          className="md:hidden block"
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? <X size={28} className ="hover:bg-blue-800 rounded " /> : <Menu size={28}  className ="hover:bg-blue-800 rounded "/>}
        </button>
      </div>

      {navOpen && (
        <div className="absolute top-16 left-0 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg md:hidden animate-fadeIn z-40">
          <div className="flex flex-col space-y-4 px-6 py-4">
            {isLoggedIn && profile?.roll === "admin" ? (
              <Link
                className={navLink}
                to="/admin"
                onClick={() => setNavOpen(false)}
              >
                Home
              </Link>
            ) : (
              <Link
                className={navLink}
                to="/"
                onClick={() => setNavOpen(false)}
              >
                Home
              </Link>
            )}

            {isLoggedIn && profile?.roll === "user" && (
              <>
                <Link
                  className={navLink}
                  to="/orders"
                  onClick={() => setNavOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  className={navLink}
                  to="/cart"
                  onClick={() => setNavOpen(false)}
                >
                  Cart
                </Link>
              </>
            )}

            {isLoggedIn && profile?.roll === "admin" && (
              <>
                <Link
                  className={navLink}
                  to="/allorders"
                  onClick={() => setNavOpen(false)}
                >
                  All Orders
                </Link>
                <Link
                  className={navLink}
                  to="/customers"
                  onClick={() => setNavOpen(false)}
                >
                  Customer
                </Link>
                <Link
                  className={navLink}
                  to="/allproducts"
                  onClick={() => setNavOpen(false)}
                >
                  All Products
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

