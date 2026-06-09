import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 1. State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Logic to check password strength
  const checkStrength = (pass) => {
    return {
      length: pass.length >= 8,
      numberOrSymbol: /[0-9!@#$%^&*]/.test(pass),
    };
  };
  const strength = checkStrength(formData.password);

  // 2. Function to handle typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
  };

  // 3. THE BACKEND CONNECTION LOGIC
  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        
        setSuccessMessage("Account created successfully! Redirecting to login...");
        
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        
        setError(data.error || "Email already in use or invalid data.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Is it running?");
    } finally {
      setLoading(false);
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
        // (Assuming you use localStorage for tokens. If you use cookies, you can skip this line)
        if (data.key) {
          localStorage.setItem("token", data.key);
        }

        // 4. NOW we go to the dashboard
        navigate("/dashboard");
      } else {
        console.error("Backend rejected Google token:", data);
        alert("Server failed to verify Google Login.");
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
      alert("Cannot connect to backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to Study Assistant
          </h1>
          <p className="text-slate-500 text-sm">
            Your Gateway to Effortless Learning
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button className="flex-1 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm">
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex-1 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/*  PASTE THIS SUCCESS BLOCK HERE  */}
          {successMessage && (
            <div className="p-4 bg-green-50 text-green-800 text-sm font-medium rounded-xl border border-green-200 flex items-center shadow-sm">
              <Check size={18} className="mr-2 text-green-600" />
              {successMessage}
            </div>
          )}
          {/*  END SUCCESS BLOCK  */}
          {/* Error Message Display */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Id
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Password Strength:{" "}
              <span
                className={
                  strength.length && strength.numberOrSymbol
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {strength.length && strength.numberOrSymbol ? "Strong" : "Weak"}
              </span>
            </p>
            <StrengthItem
              isValid={strength.length}
              text="At least 8 characters"
            />
            <StrengthItem
              isValid={strength.numberOrSymbol}
              text="Contains a number or symbol"
            />
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="relative flex py-2 items-center mt-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log("Google Signup Failed");
                alert("Google Signup Failed!");
              }}
              useOneTap
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StrengthItem = ({ isValid, text }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500">
    {isValid ? (
      <Check size={14} className="text-green-500" />
    ) : (
      <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
    )}
    <span className={isValid ? "text-slate-700" : ""}>{text}</span>
  </div>
);

const SocialButton = ({ icon, color }) => (
  <button
    className={`w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold bg-white hover:bg-slate-50 hover:border-blue-200 transition-all ${color}`}
  >
    {icon}
  </button>
);

export default Signup;
