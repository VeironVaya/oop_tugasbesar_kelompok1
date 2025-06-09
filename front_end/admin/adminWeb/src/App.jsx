import { useState } from "react";
import React from "react";
import "./App.css";
import Login from "./pages/Login";
import Listitems from "./pages/ListItems";
import Add from "./pages/Add";
import Order from "./pages/Order";
import Navbar from "./components/navbar";
import Sidebar from "./components/Sidebar";
import Editdetails from "./pages/editdetails";
import AddStock from "./pages/addstock";
import { Route, Routes, useLocation } from "react-router-dom";
import OrderDetail from "./pages/OrderDetail";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  // Cek apakah di halaman login
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Jangan tampilkan navbar & sidebar di halaman login */}
      {!isLoginPage && <Navbar />}

      <div className="flex">
        {!isLoginPage && <Sidebar />}

        {/* Main content area */}
        <div className={`flex-1 ${!isLoginPage ? "ml-0" : ""}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/listitems" element={<Listitems />} />
            <Route path="/editdetails/:productId" element={<Editdetails />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/edit/:productId/addstock" element={<AddStock />} />
            <Route path="/additems" element={<Add />} />
            <Route path="/orders" element={<Order />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
