import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  // Simulated auth status - replace this with real auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Simulated logout
    setIsLoggedIn(false);
    console.log("User logged out");
    // Perform actual logout logic here, like clearing tokens
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
          <>
            <Link to="/signin">Signin</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
