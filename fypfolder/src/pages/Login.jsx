import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  
  const handleLogin = async () => {
    // Basic check: Don't send empty data
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      // 3. Send data to the Rocket Ship (Backend)
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        console.log("Login Success!");
        
        
        if (data.is_admin) {
            navigate('/admin-dashboard'); 
        } else {
            navigate('/dashboard');       
        }
        

      } else {
        
        alert(data.error || 'Login failed. Check your password.');
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert('Failed to connect to the server. Is the backend running?');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Resume your journey</h2>
        <p className="text-center text-slate-500 mb-6">Welcome back!</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email Id</label>
            <input 
              type="email" 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="hello@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // <--- Toggles text/dots
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                placeholder="••••••••"
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
                <a href="#" className="text-xs text-blue-500 hover:underline">Forgot Password?</a>
            </div>
          </div>

          
          <button 
            onClick={handleLogin} // <--- This connects the button to the function!
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;