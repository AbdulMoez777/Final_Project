import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  Layers, 
  UploadCloud, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Clock,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In the future, clear user tokens here
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <BrainCircuit className="fill-blue-600 text-white" /> StudyAI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
          {/* Project Specific Modules */}
          <SidebarItem icon={<FileText size={20} />} text="Summarizer" />
          <SidebarItem icon={<Zap size={20} />} text="Quiz Generator" />
          <SidebarItem icon={<Layers size={20} />} text="Flashcards" />
          <SidebarItem icon={<UploadCloud size={20} />} text="My Files" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-slate-500">
            <h2 className="text-xl font-bold text-slate-800">Overview</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search summaries..." 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
              />
            </div>
            <button className="relative text-slate-500 hover:text-blue-600">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              AM
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-6xl mx-auto">
            {/* Welcome Banner */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, Abdul Moez! 👋</h1>
              <p className="text-slate-500 mt-1">Ready to generate some new study materials today?</p>
            </div>

            {/* Quick Actions (The Modules) */}
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ActionCard 
                onClick={() => navigate('/summary')}
                title="Generate Summary" 
                desc="Upload notes to get a concise summary." 
                icon={<FileText size={32} className="text-white" />} 
                color="bg-blue-600"
              />
              <ActionCard 
                title="Create Quiz" 
                desc="Test your knowledge with AI questions." 
                icon={<Zap size={32} className="text-white" />} 
                color="bg-purple-600"
              />
              <ActionCard 
                title="Make Flashcards" 
                desc="Convert slides into revision cards." 
                icon={<Layers size={32} className="text-white" />} 
                color="bg-orange-500"
              />
            </div>

            {/* Main Stats & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Stats & Goals */}
              <div className="space-y-8">
                {/* Stats Row */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-800 mb-4">Your Progress</h3>
                   <div className="space-y-4">
                      <StatRow label="Files Uploaded" value="12" />
                      <StatRow label="Quizzes Taken" value="5" />
                      <StatRow label="Flashcards Reviewed" value="45" />
                   </div>
                </div>

                {/* Goals */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Daily Goals</h3>
                  <div className="space-y-3">
                    <GoalItem text="Summarize Physics Ch.1" completed />
                    <GoalItem text="Take React Quiz" />
                    <GoalItem text="Upload History PDF" />
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Activity (Taking up 2 columns space on large screens) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Recent AI Activity</h3>
                <div className="space-y-4">
                  <ActivityItem 
                    type="Summary" 
                    title="Deep Learning Fundamentals" 
                    file="lecture_5.pdf" 
                    time="2 hours ago" 
                    icon={<FileText size={18} className="text-blue-600" />}
                    bg="bg-blue-50"
                  />
                  <ActivityItem 
                    type="Quiz" 
                    title="Operating Systems Quiz" 
                    file="os_notes.docx" 
                    time="5 hours ago" 
                    icon={<Zap size={18} className="text-purple-600" />}
                    bg="bg-purple-50"
                  />
                  <ActivityItem 
                    type="Flashcards" 
                    title="Marketing Key Terms" 
                    file="mkt_slides.pptx" 
                    time="1 day ago" 
                    icon={<Layers size={18} className="text-orange-600" />}
                    bg="bg-orange-50"
                  />
                   <ActivityItem 
                    type="Summary" 
                    title="Pakistan History 1947-2023" 
                    file="history_book.pdf" 
                    time="2 days ago" 
                    icon={<FileText size={18} className="text-blue-600" />}
                    bg="bg-blue-50"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */

const SidebarItem = ({ icon, text, active }) => (
  <button className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
    {icon} {text}
  </button>
);

const ActionCard = ({ title, desc, icon, color, onClick }) => (
  <button 
   onClick={onClick}
   className={`${color} p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left group`}>
    <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
    <p className="text-blue-100 text-sm">{desc}</p>
  </button>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-900 font-bold">{value}</span>
  </div>
);

const ActivityItem = ({ type, title, file, time, icon, bg }) => (
  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors bg-slate-50/50">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 flex items-center gap-1">
           Generated from: <span className="font-medium text-slate-600">{file}</span>
        </p>
      </div>
    </div>
    <div className="text-right">
       <span className="inline-block px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 mb-1">{type}</span>
       <p className="text-xs text-slate-400">{time}</p>
    </div>
  </div>
);

const GoalItem = ({ text, completed }) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded border flex items-center justify-center ${completed ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
      {completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
    </div>
    <span className={`text-sm ${completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{text}</span>
  </div>
);

export default Dashboard;