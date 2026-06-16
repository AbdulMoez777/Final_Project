import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/LandingPage'; 
import Summary from './pages/Summary';
import QuizGenerator from './pages/QuizGenerator';
import FlashcardsPage from './pages/FlashcardsPage';
import ActivityViewer from './pages/ActivityViewer';
import Settings from './pages/Settings';
import YoutubeNotesPage from './pages/YoutubeNotesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This line tells the app: "When at '/', show Landing Page" */}
        <Route path="/" element={<Landing />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/quiz-generator" element={<QuizGenerator />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/activity/:id" element={<ActivityViewer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/youtube-notes" element={<YoutubeNotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;