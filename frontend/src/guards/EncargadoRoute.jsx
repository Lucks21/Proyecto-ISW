import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EncargadoRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  if (user.roles.every((role) => role !== "encargado")) {
    return <Navigate to="/" />;
  }
  return children;
};

export default EncargadoRoute;
