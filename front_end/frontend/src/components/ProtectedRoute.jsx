// === src/components/ProtectedRoute.jsx ===
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const { token, logout } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // dalam detik

      if (decoded.exp && decoded.exp < now) {
        console.warn("🔒 Token sudah expired");
        logout(); // bersihkan localStorage & context
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("❌ Gagal decode token:", error);
      logout(); // fallback aman
      navigate("/login", { replace: true });
    }
  }, [token, logout, navigate]);

  if (!token) return null;

  return children;
};

export default ProtectedRoute;
