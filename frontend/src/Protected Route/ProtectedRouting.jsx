

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const profile  = useContext(ProfileContext);
  console.log(profile)

  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.roll)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
