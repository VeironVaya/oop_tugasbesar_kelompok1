import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/customers/registration",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (response.status === 200 || result.status === true) {
        alert("Registrasi berhasil. Silakan login.");
        navigate("/login"); // redirect ke halaman login
      } else {
        alert(result.message || "Registrasi gagal");
      }
    } catch (error) {
      console.error("Register error:", error);
      if (error.response) {
        alert(
          error.response.data.message || "Registrasi gagal (response error)"
        );
      } else {
        alert("Terjadi kesalahan saat menghubungi server.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md px-8 py-10 border border-gray-200 rounded-md shadow-sm"
      >
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold relative inline-block">
            REGISTER
            <span className="block w-full h-0.5 bg-black mt-1" />
          </h2>
        </div>

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

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md font-semibold tracking-wide hover:bg-gray-800"
        >
          REGISTER
        </button>

        <p className="text-center text-sm text-black mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
