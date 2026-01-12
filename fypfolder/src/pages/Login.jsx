import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Resume your learning journey.</p>
        </div>

        {/* Tabs - Sign In is Active here */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button 
            onClick={() => navigate('/signup')}
            className="flex-1 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all"
          >
            Sign Up
          </button>
          <button className="flex-1 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm transition-all">
            Sign In
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Id</label>
            <input type="email" placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all">
            Sign In
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold bg-white text-red-500 hover:bg-slate-50">G</button>
            <button className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold bg-white text-black hover:bg-slate-50"></button>
            <button className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold bg-white text-blue-500 hover:bg-slate-50">⊞</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;