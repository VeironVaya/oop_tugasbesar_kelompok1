// === src/components/Navbar.jsx (Fungsionalitas Disesuaikan) ===

import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext"; // ✅ UBAH: Gunakan useShop hook
import SearchBar from "./SearchBar";

const Navbar = () => {
  // ✅ UBAH: Ambil state dan fungsi yang benar dari context
  const { user, logout, cartItems, setShowSearch, showSearch } = useShop();
  // HAPUS: Kita tidak lagi mengambil setUser dan setUserRole

  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ UBAH: handleLogout sekarang memanggil fungsi dari context
  const handleLogout = () => {
    logout(); // Memanggil fungsi logout dari ShopContext
    setDropdownOpen(false);
    navigate("/login");
  };

  // Fungsi-fungsi untuk UI (dropdown dan search) tidak perlu diubah
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (location.pathname.includes("collection")) {
      setShowSearch(true);
    } else {
      navigate("/collection");
      setTimeout(() => setShowSearch(true), 100);
    }
  };

  // Seluruh bagian JSX di bawah ini TIDAK DIUBAH secara struktur,
  // hanya penyesuaian kecil pada cara menampilkan nama user.

  return (
    <>
      <div className="flex items-center justify-between py-5 font-medium">
        {/* Logo */}
        <img src={assets.logo} className="w-36" alt="Logo" />

        {/* Navigation */}
        <ul className="hidden sm:flex gap-5 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? "font-semibold text-black" : "text-gray-500 hover:text-black transition"}>
            HOME
          </NavLink>
          <NavLink to="/collection" className={({ isActive }) => isActive ? "font-semibold text-black" : "text-gray-500 hover:text-black transition"}>
            COLLECTION
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "font-semibold text-black" : "text-gray-500 hover:text-black transition"}>
            ABOUT
          </NavLink>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-6 text-sm text-gray-700">
          {/* <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
            onClick={handleSearchClick}
          /> */}
          <img
            src={assets.cart_icon}
            className="w-5 cursor-pointer"
            alt="Cart"
            onClick={() => {
              if (user) {
                navigate("/cart");
              } else {
                navigate("/login");
              }
            }}
          />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <span
                onClick={toggleDropdown}
                className={`hidden sm:flex items-center cursor-pointer select-none px-3 py-1 rounded border ${
                  dropdownOpen
                    ? "bg-gray-200 border-gray-600"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                {/* ✅ UBAH: Tampilkan username dari properti 'sub' */}
                {user.username} 
                <svg
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-md z-10">
                  <NavLink to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                    My Order
                  </NavLink>
                  <NavLink to="/my-favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                    My Favorite
                  </NavLink>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">
              Login
            </NavLink>
          )}
        </div>
      </div>
      <SearchBar />
    </>
  );
};

export default Navbar;