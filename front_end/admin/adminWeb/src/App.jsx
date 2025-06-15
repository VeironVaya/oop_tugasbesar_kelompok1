import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/PrivateRoute.jsx"; // This now directly checks localStorage

// Import Pages
import Login from "./pages/Login.jsx";
import Listitems from "./pages/ListItems.jsx";
import Add from "./pages/Add.jsx";
import Order from "./pages/Order.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Editdetails from "./pages/editdetails.jsx";
import AddStock from "./pages/addstock.jsx";

// Import CSS
import "./App.css";

function App() {
  const location = useLocation();
  // Directly check localStorage for authentication status
  const isAuthenticated = !!localStorage.getItem("token");
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Conditionally render Navbar and Sidebar */}
      {!isLoginPage && <Navbar />}
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <div className={`flex-1 ${!isLoginPage ? "ml-0" : ""}`}>
          <Routes>
            {/* PUBLIC ROUTE: Login Page */}
            {/* This path is always accessible */}
            <Route path="/login" element={<Login />} />

            {/*
              PROTECTED ROUTES:
              Use ProtectedRoute as a layout route.
              All nested routes within this <Route> will be protected.
              If not authenticated, ProtectedRoute will redirect to /login.
            */}
            <Route element={<ProtectedRoute />}>
              {/* ROOT PATH REDIRECT:
                  If authenticated and at "/", redirect to "/listitems".
                  If not authenticated, ProtectedRoute will handle the redirect to /login
                  before this route is even considered.
              */}
              <Route path="/" element={<Navigate to="/listitems" replace />} />

              {/* Protected Pages */}
              <Route path="/listitems" element={<Listitems />} />
              <Route path="/additems" element={<Add />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/editdetails/:productId" element={<Editdetails />} />
              <Route path="/edit/:productId/addstock" element={<AddStock />} />
            </Route>

            {/* CATCH-ALL ROUTE for unknown paths:
                Redirects any unmatched path.
                If authenticated, redirect to /listitems.
                If not authenticated, redirect to /login.
            */}
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/listitems" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
