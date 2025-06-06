import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/login.json'; // make sure the file exists

const Login = () => {
  const [username, setUsername] = useState('');  // changed from email to username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uri="http://ems-app-env-1.eba-tbst2szu.eu-north-1.elasticbeanstalk.com"

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(username,password)

    try {
      const res = await fetch(`${uri}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),  // send username instead of email
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 px-4 py-8">
      {/* Lottie Section */}
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
        <Lottie
          animationData={loginAnimation}
          className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[450px]"
        />
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-6">
          Login to EMS
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition duration-200 ${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
