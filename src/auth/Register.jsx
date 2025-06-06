import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/login.json'; // Ensure this file exists

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // default value
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const uri="http://ems-app-env-1.eba-tbst2szu.eu-north-1.elasticbeanstalk.com"

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log(username, password);
        // const password1="12345"

        try {
            const res = await fetch(`${uri}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await res.json();

            if (res.ok) {
                navigate("/login");  // Redirect to login page
            } else {
                alert(data.message || "Registration failed");
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

            {/* Registration Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-6">
                    Register to EMS
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md text-white transition duration-200 ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
