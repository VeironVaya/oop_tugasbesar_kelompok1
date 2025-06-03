import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const { user, setUser, setUserRole, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("role");
    navigate("/login");
  };

  const cartItemCount = Object.values(cartItems || {}).reduce(
    (sum, item) => sum + item,
    0
  );

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <img src={assets.logo} className="w-36" alt="Logo" />

      {/* Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/collection">COLLECTION</NavLink>
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/contact">CONTACT</NavLink>
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-6 text-sm text-gray-700">
        <img
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
        />

        <div className="relative cursor-pointer">
          <img src={assets.cart_icon} className="w-6" alt="Cart" />
          {cartItemCount > 0 && (
            <span className="absolute -bottom-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>

        {user ? (
          <>
            <span className="hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition"
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
