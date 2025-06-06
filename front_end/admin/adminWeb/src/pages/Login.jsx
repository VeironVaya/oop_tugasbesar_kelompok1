import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = values;

    if (username === "admin" && password === "admin123") {
        localStorage.setItem("loggedIn", "true");
        navigate("/"); // Arahkan ke home
    } else {
        alert("Username atau password salah");
    }


    // Jika ingin pakai API login:
    // try {
    //   const res = await axios.post('/api/login', values);
    //   if (res.data.success) {
    //     navigate("/dashboard");
    //   } else {
    //     alert("Login gagal");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   alert("Terjadi kesalahan saat login");
    // }
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
            name="username"
            value={values.username}
            onChange={handleChange}
            required
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        {/* Input: Password */}
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            className="w-full border-b border-black focus:outline-none py-2 placeholder-gray-400"
          />
        </div>

        {/* Button: Login */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md font-semibold tracking-wide hover:bg-gray-800"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;
