import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../../utils/fetch";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      return 3;
    return 2;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    apiRequest("users/register", "POST", {
      email: email,
      username: username,
      password: password,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to register User");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);

        // Redirect to Home page on successful registration
        navigate("/");
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Sign up banner */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Sign up to <span className="text-indigo-600">Hanki</span>
            </h2>

            {/* Social Media Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="flex items-center justify-center whitespace-nowrap w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
              >
                <i className="fab fa-google text-red-500 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center whitespace-nowrap w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
              >
                <i className="fab fa-apple text-gray-800 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">
                  Continue with Apple
                </span>
              </button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Main Form */}
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {/* Email div */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Username div */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password div */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="!rounded-button whitespace-nowrap absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fa ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } text-gray-400`}
                    ></i>
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-gray-500">
                        Password strength:
                      </div>
                      <div className="text-xs font-medium">
                        {passwordStrength === 1 && (
                          <span className="text-red-500">Weak</span>
                        )}
                        {passwordStrength === 2 && (
                          <span className="text-yellow-500">Medium</span>
                        )}
                        {passwordStrength === 3 && (
                          <span className="text-green-500">Strong</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          passwordStrength === 1
                            ? "bg-red-500 w-1/3"
                            : passwordStrength === 2
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-medium text-gray-700 cursor-pointer"
                  >
                    I agree to the
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500 mx-1"
                    >
                      Terms of Service
                    </a>
                    and
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500 ml-1"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="!rounded-button whitespace-nowrap w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
