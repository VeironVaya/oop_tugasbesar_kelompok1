// === src/App.jsx ===
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Import Components
// CORRECTED PATHS: Assuming standard file names (PascalCase) and adding extensions for clarity.
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

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
  // Determine if the current page is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Conditionally render Navbar and Sidebar so they don't show on the login page */}
      {!isLoginPage && <Navbar />}
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <div className={`flex-1 ${!isLoginPage ? "ml-0" : ""}`}>
          <Routes>
            {/* PUBLIC ROUTE: Login Page */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED ROUTES: All admin pages are wrapped in PrivateRoute */}
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
              path="/order/:id"
              element={
                <PrivateRoute>
                  <OrderDetail />
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
              path="/edit/:productId/addstock"
              element={
                <PrivateRoute>
                  <AddStock />
                </PrivateRoute>
              }
            />

            {/* ROOT PATH REDIRECT: Redirects from "/" to "/listitems" */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/listitems" replace />
                </PrivateRoute>
              }
            />
            
            {/* CATCH-ALL (Optional): Redirect any other path to the main page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
