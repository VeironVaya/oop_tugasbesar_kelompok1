// File: src/components/RequireAuth.jsx

import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const RequireAuth = ({ allowedRoles }) => {
  const { user } = useShop();
  const location = useLocation();

  // 1. Cek apakah pengguna sudah login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cek apakah peran pengguna diizinkan.
  const userRole = user.role || 'user'; // Default ke 'user' jika role tidak ada

  return allowedRoles?.includes(userRole) ? (
    <Outlet /> // Jika diizinkan, tampilkan halaman
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace /> // Jika tidak, arahkan ke halaman unauthorized
  );
};

export default RequireAuth;