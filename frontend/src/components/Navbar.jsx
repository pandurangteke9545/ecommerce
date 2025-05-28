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
      // Call backend to clear the cookie
      await api.post(
        "/auth/logout", // change to your backend URL
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Cookie clearing failed:", err);
    }

    // Remove token from localStorage
    localStorage.removeItem("token");

    // Update UI
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
      <Link to="/" className="text-xl font-bold">OnlineMart</Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        ) : (
          <Link to="/signin">Signin</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


// components/Navbar.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   // Check token in localStorage
//   const checkLoginStatus = () => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   };

//   useEffect(() => {
//     checkLoginStatus();

//     // Listen for auth change
//     window.addEventListener("authChange", checkLoginStatus);

//     return () => {
//       window.removeEventListener("authChange", checkLoginStatus);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     window.dispatchEvent(new Event("authChange"));
//     navigate("/signin");
//   };

//   return (
//     <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
//       <Link to="/" className="text-xl font-bold">OnlineMart</Link>
//       <div className="space-x-4">
//         <Link to="/">Home</Link>
//         <Link to="/cart">Cart</Link>
//         {isLoggedIn ? (
//           <button onClick={handleLogout} className="hover:underline">Logout</button>
//         ) : (
//           <Link to="/signin">Signin</Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
