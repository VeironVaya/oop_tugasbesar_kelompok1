import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useShop } from "../context/ShopContext";

// Helper untuk menyimpan data ke localStorage
const storeAuthData = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("tokenType", data.tokenType);
  localStorage.setItem("tokenExpiry", data.expiredAt);
  localStorage.setItem("id_customer", data.id_customer);
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUser, setUserRole } = useShop();
  const navigate = useNavigate();

  // Handler login utama
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username dan password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login/login-customer",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const result = res.data;

      if (result.status) {
        storeAuthData(result.data);

        setUser({ username, id_customer: result.data.id_customer });

        // Menentukan role user (sementara via username)
        const role = username === "admin" ? "admin" : "user";
        setUserRole(role);
        localStorage.setItem("role", role);

        // Redirect sesuai role
        navigate(role === "admin" ? "/admin/add-items" : "/");
      } else {
        setErrorMsg(result.message || "Username atau password salah");
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message || "Login gagal (response error)");
      } else {
        setErrorMsg("Terjadi kesalahan saat menghubungi server.");
      }
    }
    setLoading(false);
  };

  // Handler untuk login sebagai admin
  const loginAsAdmin = () => {
    setUsername("admin");
    setPassword("admin123");
    setErrorMsg("");
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

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 text-center text-red-600">{errorMsg}</div>
        )}

        {/* Input Username */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading}
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        {/* Input Password */}
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        {/* Links */}
        <div className="flex justify-between text-sm text-black mt-2 mb-6">
          <a href="#" className="hover:underline">
            Forget Your Password?
          </a>
          <Link to="/regist" className="hover:underline">
            Create Account
          </Link>
        </div>

        {/* Button Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md font-semibold tracking-wide hover:bg-gray-800"
        >
          {loading ? "Processing..." : "LOGIN"}
        </button>

        {/* Button Login as Admin */}
        <p className="text-center text-sm text-black mt-6">
          <button
            type="button"
            onClick={loginAsAdmin}
            className="hover:underline"
            disabled={loading}
          >
            Login as Admin
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
