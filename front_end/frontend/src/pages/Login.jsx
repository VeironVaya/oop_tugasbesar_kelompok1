// === src/pages/Login.jsx (FINAL) ===
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useShop } from "../context/ShopContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("Username dan password harus diisi");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login/login-customer",
        { username, password }
      );
      
      const result = res.data;

      if (result.status) {
        const customerId = result.id;
        const token = result.data.token;

        if (token && customerId) {
          login(token, customerId);
          navigate(redirectPath, { replace: true });
        } else {
          setErrorMsg("Response dari server tidak lengkap.");
        }
      } else {
        setErrorMsg(result.message || "Login gagal.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  // ... JSX Form Anda tetap sama ...
  return (
    <div className="flex justify-center items-center h-screen bg-white">



      <form



        onSubmit={handleLogin}



        className="w-full max-w-md px-8 py-10 border border-gray-200 rounded-md shadow-sm"



      >



        <h2 className="text-xl font-semibold mb-8 text-center">LOGIN</h2>







        {errorMsg && (



          <div className="text-red-600 text-center mb-4">{errorMsg}</div>



        )}







        <input



          type="text"



          placeholder="Username"



          value={username}



          onChange={(e) => setUsername(e.target.value)}



          className="w-full border-b border-black py-2 mb-4"



        />







        <input



          type="password"



          placeholder="Password"



          value={password}



          onChange={(e) => setPassword(e.target.value)}



          className="w-full border-b border-black py-2 mb-4"



        />







        <button



          type="submit"



          disabled={loading}



          className="w-full bg-black text-white py-2 rounded"



        >



          {loading ? "Processing..." : "LOGIN"}



        </button>







        <p className="text-center text-sm mt-4">



          <Link to="/regist" className="text-blue-500 hover:underline">



            Create Account



          </Link>



        </p>



      </form>



    </div>



  );



};



export default Login;