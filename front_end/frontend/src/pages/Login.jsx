import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setUserRole } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login/login-customer",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.status) {
        // Simpan token di localStorage
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("tokenType", result.data.tokenType);
        localStorage.setItem("tokenExpiry", result.data.expiredAt);

        // Set user dan role di context
        setUser({ username });

        // Sementara role ditentukan dari username
        const role = username === "admin" ? "admin" : "user";
        setUserRole(role);
        localStorage.setItem("role", role);

        // Redirect sesuai role
        if (role === "admin") {
          navigate("/admin/add-items");
        } else {
          navigate("/");
        }
      } else {
        alert(result.message || "Username atau password salah");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        alert(error.response.data.message || "Login gagal (response error)");
      } else {
        alert("Terjadi kesalahan saat menghubungi server.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md px-8 py-10 border border-gray-200 rounded-md shadow-sm"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold relative inline-block">
            LOGIN
            <span className="block w-full h-0.5 bg-black mt-1" />
          </h2>
        </div>

        {/* Input: Username */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        {/* Input: Password */}
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        {/* Link: Forgot & Create */}
        <div className="flex justify-between text-sm text-black mt-2 mb-6">
          <a href="#" className="hover:underline">
            Forget Your Password?
          </a>
          <Link to="/regist" className="hover:underline">
            Create Account
          </Link>
        </div>

        {/* Button: Login */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md font-semibold tracking-wide hover:bg-gray-800"
        >
          LOGIN
        </button>

        {/* Link: Login as Admin */}
        <p className="text-center text-sm text-black mt-6">
          <button
            type="button"
            onClick={() => {
              setUsername("admin");
              setPassword("admin123");
            }}
            className="hover:underline"
          >
            Login as Admin
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
