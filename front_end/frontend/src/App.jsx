// === src/App.jsx ===

import React from "react";
import { Routes, Route } from "react-router-dom";

// Halaman Umum
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Login from "./pages/Login";
import Regist from "./pages/Regist";
import Unauthorized from "./pages/Unauthorized";

// Komponen
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Halaman Proteksi (Butuh Login)
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import MyFavorite from "./pages/MyFavorite";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        {/* === Rute Publik === */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* === Rute Proteksi (Butuh Login) === */}
        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:transactionId"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-favorites"
          element={
            <ProtectedRoute>
              <MyFavorite />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
