import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import MyFavorite from "./pages/MyFavorite";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import Regist from "./pages/Regist";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-9[vw]">
      <Navbar />
      <Routes>
        <Route path="/my-favorites" element={<MyFavorite />} />
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/regist" element={<Regist />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
