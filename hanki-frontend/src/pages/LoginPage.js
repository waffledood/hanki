import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { apiRequest } from "../utils/fetch";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

    apiRequest("auth/login", "POST", {
      username: username,
      password: password,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to login User");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.success);
        navigate(from, { replace: true });
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          {/* Sign in banner */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Sign in to <span className="text-indigo-600">Hanki</span>
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your password"
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } text-gray-400`}
                  ></i>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
            >
              Log In
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a
              href="#"
              className="text-indigo-600 text-sm hover:text-indigo-800 cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Social Login Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 !rounded-button whitespace-nowrap cursor-pointer">
              <i className="fab fa-google text-red-500 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>

            {/* Facebook */}
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 !rounded-button whitespace-nowrap cursor-pointer">
              <i className="fab fa-facebook text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">
                Facebook
              </span>
            </button>

            {/* Apple */}
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 !rounded-button whitespace-nowrap cursor-pointer">
              <i className="fab fa-apple text-gray-800 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">Apple</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="text-indigo-600 font-medium ml-1 hover:text-indigo-800 cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
