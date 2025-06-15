// === src/App.jsx (FIXED) ===

import React from "react";
import { Routes, Route } from "react-router-dom";

// Impor semua komponen dan halaman Anda
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import Regist from "./pages/Regist";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./pages/Unauthorized";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        {/* --- Rute Publik --- */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/product/:productId" element={<Product />} />

        {/* --- Rute Terproteksi --- */}
        <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          
          {/* ✅ DIPERBAIKI: Tambahkan '/' dan pindahkan ke dalam blok ini */}
          <Route path="/checkout/:transactionId" element={<Checkout />} />
          
          {/* Tambahkan rute terproteksi lainnya di sini */}
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;