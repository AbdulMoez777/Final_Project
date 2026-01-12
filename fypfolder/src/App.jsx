import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// FIX 1: Correct the path (use ./ instead of .src/)
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    // FIX 2: Wrap everything in <Router> so useNavigate works
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;