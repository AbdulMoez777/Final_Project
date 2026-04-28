import React, { useState, useEffect } from "react";
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
  Zap,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentActivities, setRecentActivities] = useState([]);

  // 👇 NEW: State to hold your actual database stats
  const [progressStats, setProgressStats] = useState({
    quizzes_taken: 0,
    flashcards_reviewed: 0,
    files_uploaded: 0,
  });

  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // 👇 UPDATED: Fetches the new combined data structure from Django
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/recent-activity/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setRecentActivities(data.recent_activity);
          setProgressStats(data.progress_stats);
        } else if (response.status === 401) {
          // If Django says "Unauthorized" (maybe the token expired)
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Failed to fetch activity from server");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active
          />
          <SidebarItem
            onClick={() => navigate("/summary")}
            icon={<FileText size={20} />}
            text="Summarizer"
          />
          <SidebarItem
            onClick={() => navigate("/quiz-generator")}
            icon={<Zap size={20} />}
            text="Quiz Generator"
          />
          <SidebarItem
            onClick={() => navigate("/flashcards")}
            icon={<Layers size={20} />}
            text="Flashcards"
          />
          
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
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, Abdul Moez! 👋
              </h1>
              <p className="text-slate-500 mt-1">
                Ready to generate some new study materials today?
              </p>
            </div>

            {/* Quick Actions */}
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ActionCard
                onClick={() => navigate("/summary")}
                title="Generate Summary"
                desc="Upload notes to get a concise summary."
                icon={<FileText size={32} className="text-white" />}
                color="bg-blue-600"
              />
              <ActionCard
                onClick={() => navigate("/quiz-generator")}
                title="Create Quiz"
                desc="Test your knowledge with AI questions."
                icon={<Zap size={32} className="text-white" />}
                color="bg-purple-600"
              />
              <ActionCard
                onClick={() => navigate("/flashcards")}
                title="Make Flashcards"
                desc="Convert slides into revision cards."
                icon={<Layers size={32} className="text-white" />}
                color="bg-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Stats & Goals */}
              <div className="space-y-8">
                {/* 👇 UPDATED: Stats Row now uses Real Data */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">
                    Your Progress
                  </h3>
                  <div className="space-y-4">
                    <StatRow
                      label="Files Uploaded"
                      value={progressStats.files_uploaded}
                    />
                    <StatRow
                      label="Quizzes Taken"
                      value={progressStats.quizzes_taken}
                    />
                    <StatRow
                      label="Flashcards Created"
                      value={progressStats.flashcards_reviewed}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Daily Goals</h3>
                  <div className="space-y-3">
                    <GoalItem text="Summarize Physics Ch.1" completed />
                    <GoalItem text="Take React Quiz" />
                    <GoalItem text="Upload History PDF" />
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Activity */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">
                  Recent AI Activity
                </h3>

                <div className="space-y-4">
                  {isLoadingActivities ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <Loader2 className="animate-spin mb-2" size={32} />
                      <p>Loading your history...</p>
                    </div>
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <DynamicActivityItem
                        key={activity.id}
                        activity={activity}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      <p>
                        No recent activity found. Generate a quiz or summary to
                        get started!
                      </p>
                    </div>
                  )}
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

const SidebarItem = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium ${active ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
  >
    {icon} {text}
  </button>
);

const ActionCard = ({ title, desc, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left group w-full`}
  >
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

const GoalItem = ({ text, completed }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-5 h-5 rounded border flex items-center justify-center ${completed ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
    >
      {completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
    </div>
    <span
      className={`text-sm ${completed ? "text-slate-400 line-through" : "text-slate-700"}`}
    >
      {text}
    </span>
  </div>
);

const DynamicActivityItem = ({ activity }) => {
  const navigate = useNavigate();
  let icon, bgClass, iconClass;

  if (activity.type === "Summary") {
    icon = <FileText size={18} />;
    bgClass = "bg-blue-50";
    iconClass = "text-blue-600";
  } else if (activity.type === "Quiz") {
    icon = <Zap size={18} />;
    bgClass = "bg-purple-50";
    iconClass = "text-purple-600";
  } else {
    icon = <Layers size={18} />;
    bgClass = "bg-orange-50";
    iconClass = "text-orange-600";
  }

  return (
    <div 
    onClick={() => navigate(`/activity/${activity.id}`)}
    className="cursor-pointer hover:shadow-md flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all bg-slate-50/50">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 ${bgClass} ${iconClass} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-slate-800">{activity.title}</h4>
            {activity.score !== null && activity.score !== undefined && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                <CheckCircle size={12} /> {activity.score}/{activity.total}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            Generated from:{" "}
            <span className="font-medium text-slate-600">{activity.file}</span>
          </p>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="inline-block px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 mb-1">
          {activity.type}
        </span>
        <p className="text-xs text-slate-400">{activity.time}</p>
      </div>
    </div>
  );
};

export default Dashboard;
