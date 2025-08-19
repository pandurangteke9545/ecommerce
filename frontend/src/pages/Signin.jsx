import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true } // ✅ Ensure cookies are stored if using sessions
      );

      // ✅ Save token if returned (adjust key if different)

      console.log("This is the token from responce",res.data.token)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // ✅ Trigger auth state update (for Navbar or other components)
      window.dispatchEvent(new Event("authChange"));
       toast.success('Login Successfully !')
       setTimeout(()=>{
          navigate("/");
       },1100)
      
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSignin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Sign In
        </button>
        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
      <ToastContainer
      autoClose='1000'
      />
    </div>
  );
};

export default Signin;
