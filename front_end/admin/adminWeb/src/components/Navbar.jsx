import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; 

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("authToken"); 
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
