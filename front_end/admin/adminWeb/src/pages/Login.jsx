// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const apiUrl = "http://localhost:8080/api/v1/auth/login/login-admin";

    try {
      const response = await axios.post(apiUrl, values);

      if (response.data) {
        localStorage.setItem("isAdminLoggedIn", "true");

        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }

        // ✅ Arahkan ke dashboard atau halaman utama admin
        navigate("/listitems");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login API error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md px-8 py-10 border border-gray-200 rounded-lg shadow-lg"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold relative inline-block">
            ADMIN LOGIN
            <span className="block w-full h-1 bg-black mt-2" />
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 text-center bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            required
            className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2 px-1 text-lg placeholder-gray-500 transition-colors"
          />
        </div>

        <div className="mb-8">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2 px-1 text-lg placeholder-gray-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-md font-semibold tracking-wide hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Logging in..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default Login;
