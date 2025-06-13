// src/App.jsx
import React from "react";
import "./App.css";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Listitems from "./pages/ListItems";
import Add from "./pages/Add";
import Order from "./pages/Order";
import Navbar from "./components/navbar";
import Sidebar from "./components/Sidebar";
import Editdetails from "./pages/editdetails";
import AddStock from "./pages/addstock";
import OrderDetail from "./pages/OrderDetail";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <div className={`flex-1 ${!isLoginPage ? "ml-0" : ""}`}>
          <Routes>
            {/* ✅ LOGIN route: redirect ke dashboard jika sudah login */}
            <Route
              path="/login"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <Navigate to="/listitems" />
                ) : (
                  <Login />
                )
              }
            />

            {/* ✅ Route utama */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/listitems" />
                </PrivateRoute>
              }
            />

            {/* ✅ Route Admin lainnya */}
            <Route
              path="/listitems"
              element={
                <PrivateRoute>
                  <Listitems />
                </PrivateRoute>
              }
            />
            <Route
              path="/additems"
              element={
                <PrivateRoute>
                  <Add />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              }
            />
            <Route
              path="/editdetails/:productId"
              element={
                <PrivateRoute>
                  <Editdetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:productId/addstock"
              element={
                <PrivateRoute>
                  <AddStock />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
