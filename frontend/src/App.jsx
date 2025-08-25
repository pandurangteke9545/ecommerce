import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Order from "./pages/order"
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import AllOrders from "./pages/AllOrders";
import Customer from "./pages/Customer";
import AllProductList from "./pages/AllProductList";
import AddProducts from "./pages/AddProducts";
import Profile from "./components/Profile";
import { ProfileProvider } from "./context/ProfileContext";
import ProtectedRoute from "./Protected Route/ProtectedRouting";
import Unauthorise from "./pages/Unauthorise";
import AdminHome from "./pages/AdminHome";


function App() {
  return (
    <Router>
      <ProfileProvider>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
          <AdminHome/>
           </ProtectedRoute>
          }/>
         
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={
          <Profile/>}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={
           <ProtectedRoute allowedRoles={["admin","user"]}>
          <Order/> 
          </ProtectedRoute>
          } />
          
    <Route path="/allorders" element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AllOrders />
      </ProtectedRoute>
      } />
    <Route path="/customers" element={
      <ProtectedRoute allowedRoles={["admin"]}>
      <Customer /> </ProtectedRoute>} />

    <Route path="/addproduct" element={
      <ProtectedRoute allowedRoles={["admin"]}>
      <AddProducts />
      </ProtectedRoute>} />
    <Route path="/allproducts" element={
      <ProtectedRoute allowedRoles={["admin"]}>
      <AllProductList /> 
      </ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorise/>}/>
        <Route path="/payment-success" element={<PaymentSuccess />}/>
        <Route path="/payment-failure" element={<PaymentFailure />}/>
      </Routes>

      </ProfileProvider>
    </Router>
  );
}

export default App;

