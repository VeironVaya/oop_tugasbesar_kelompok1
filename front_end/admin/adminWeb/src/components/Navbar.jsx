import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();

  // Get token
  const token = localStorage.getItem("token");
  console.log("Token in Navbar:", token);

  useEffect(() => {
    if (!token) {
      alert("Unauthorized: Please log in first.");
      navigate("/login");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    console.log("Token removed. Logging out...");
    navigate("/login");
  };

  return (
    <div className="w-full flex items-center justify-between bg-gray-50 px-6 py-4 border-b">
      <div className="flex flex-col">
        <img src={assets.logo} alt="Logo" className="h-10 w-auto mb-1" />
        <p className="text-pink-400 text-sm font-semibold">ADMIN PANEL</p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
