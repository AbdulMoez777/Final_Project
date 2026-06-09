import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // 👇 Added this state variable for the custom error message
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // Clear any previous errors when they try again
    setError("");

    // Basic check: Don't send empty data
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      // 3. Send data to the Rocket Ship (Backend)
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Login Success!");

        if (data.is_admin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // 👇 Replaced the alert with the custom error state
        setError(data.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setError("Failed to connect to the server. Is the backend running?");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // 1. Send the Google token to our Django backend
      const response = await fetch("http://127.0.0.1:8000/api/auth/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential, // The token from Google
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Django verified it and created the user!
        console.log("Backend accepted Google Login!", data);

        // 3. Save the NEW ticket, overwriting the hello@gmail.com ticket
        if (data.key) {
          localStorage.setItem("token", data.key);
        }

        // 4. NOW we go to the dashboard
        navigate("/dashboard");
      } else {
        console.error("Backend rejected Google token:", data);
        setError("Server failed to verify Google Login.");
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
      setError("Cannot connect to backend.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">
          Resume your journey
        </h2>
        <p className="text-center text-slate-500 mb-6">Welcome back!</p>

        <div className="space-y-4">
          {/* 👇 Added the custom red error box UI here 👇 */}
          {error && (
            <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 flex items-center gap-2 shadow-sm animate-fade-in-down">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {/* 👆 End error box 👆 */}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email Id
            </label>
            <input
              type="email"
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <a href="#" className="text-xs text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
          >
            Sign In
          </button>
        </div>

        <div className="relative flex items-center justify-center w-full mt-6 mb-6">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-sm text-slate-400 absolute">
            Or continue with
          </span>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
              setError("Google Login Failed!");
            }}
            useOneTap
          />
        </div>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
