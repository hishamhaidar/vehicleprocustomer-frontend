import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";
import jwtDecode from "jwt-decode";

const RequireAuth = ({ signOut }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const isTokenValid = () => {
    const decoded = auth?.jwtToken ? jwtDecode(auth.jwtToken) : undefined;

    if (decoded && decoded.exp) {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (currentTimeInSeconds >= decoded.exp) {
        signOut();
        return false;
      }
      return true;
    }
    return false;
  };

  return isTokenValid() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
