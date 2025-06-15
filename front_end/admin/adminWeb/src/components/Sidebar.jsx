import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("Token in Sidebar:", token);

  useEffect(() => {
    if (!token) {
      alert("Unauthorized: Please log in first.");
      navigate("/login");
    }
  }, [navigate, token]);

  return (
    <div className="w-60 min-h-screen bg-white p-4 border-r">
      <div className="flex flex-col gap-4">
        <NavLink
          to="/additems"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 border rounded-md transition ${
              isActive
                ? "bg-blue-200 text-black"
                : "bg-gray-50 text-black hover:bg-pink-200"
            }`
          }
        >
          <img src={assets.add_icon} alt="Add" className="w-5 h-5" />
          <span className="font-semibold">Add Items</span>
        </NavLink>

        <NavLink
          to="/listitems"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 border rounded-md transition ${
              isActive
                ? "bg-blue-200 text-black"
                : "bg-gray-50 text-black hover:bg-pink-100"
            }`
          }
        >
          <img src={assets.order_icon} alt="List" className="w-5 h-5" />
          <span className="font-semibold">List Items</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 border rounded-md transition ${
              isActive
                ? "bg-blue-200 text-black"
                : "bg-gray-50 text-black hover:bg-pink-100"
            }`
          }
        >
          <img src={assets.order_icon} alt="Orders" className="w-5 h-5" />
          <span className="font-semibold">Orders</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
