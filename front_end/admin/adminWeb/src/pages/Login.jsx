// === src/pages/Login.jsx ===
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Username and password are required");
      return;
    }

    setStatus("loading");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login/login-admin",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = res.data;
      console.log("Login API Response:", result);

      // Try to retrieve token from possible nested structure
      const token = result.token || result.data?.token;
      const userId = result.data?.id_customer || result.data?.id || null;

      if (result.status && token) {
        setStatus("success");

        // Store token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: userId,
            username,
          })
        );

        // Navigate to the protected page
        navigate("/listitems");
      } else {
        setErrorMsg(result.message || "Login failed. Token not received.");
        setStatus("error");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to connect to the server.";
      setErrorMsg(message);
      setStatus("error");
    }
  };

  const getButtonText = () => {
    if (status === "loading") return "Processing...";
    if (status === "success") return "Success!";
    return "LOGIN";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md px-8 py-10 border border-gray-200 rounded-md shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-8 text-center">ADMIN LOGIN</h2>

        {errorMsg && status === "error" && (
          <div className="text-red-600 text-center mb-4">{errorMsg}</div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setStatus("idle");
          }}
          className="w-full border-b border-black py-2 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
          }}
          className="w-full border-b border-black py-2 mb-4"
        />

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`w-full text-white py-2 rounded transition-colors duration-300 ${
            status === "success" ? "bg-green-500" : "bg-black"
          } ${
            status === "loading" || status === "success"
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};

export default Login;
