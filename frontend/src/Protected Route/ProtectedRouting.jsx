import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { profile, loading } = useContext(ProfileContext);
  console.log(profile)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  
  setTimeout(()=>{

    if (!profile) {
    return <Navigate to="/signin" replace />;
  }

   if (allowedRoles && !allowedRoles.includes(profile.roll)) {
    return <Navigate to="/unauthorized" replace />;
  }

  },100)
  
  return children;
};

export default ProtectedRoute;


