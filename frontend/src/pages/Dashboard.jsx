import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Layers,
  Settings,
  LogOut,
  Search,
  Bell,
  Zap,
  Loader2,
  CheckCircle,
  Trash2,
  MessageCircle,
  X,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentActivities, setRecentActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Student");

  const [userAvatar, setUserAvatar] = useState(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [progressStats, setProgressStats] = useState({
    summaries_generated: 0,
    quizzes_taken: 0,
    flashcards_reviewed: 0,
    files_uploaded: 0,
  });

  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hi! I am your AI assistant. Ask me any quick question!",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

          if (data.username) {
            setUserName(data.username);
          }
          if (data.avatar) {
            setUserAvatar(data.avatar);
          }
        } else if (response.status === 401) {
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

    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://127.0.0.1:8000/api/goals/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) setGoals(await res.json());
      } catch (err) {
        console.error("Error fetching goals", err);
      }
    };

    fetchRecentActivity();
    fetchGoals();
  }, [navigate]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/goals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ text: newGoalText }),
      });
      if (res.ok) {
        const newGoal = await res.json();
        setGoals([newGoal, ...goals]);
        setNewGoalText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleGoal = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/goals/${id}/`, {
        method: "PUT",
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const updatedGoal = await res.json();
        setGoals(
          goals
            .map((g) => (g.id === id ? updatedGoal : g))
            .sort((a, b) => a.completed - b.completed),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/goals/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredActivities = recentActivities.filter((activity) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      activity.title.toLowerCase().includes(searchLower) ||
      activity.file.toLowerCase().includes(searchLower) ||
      activity.type.toLowerCase().includes(searchLower)
    );
  });

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory([...chatHistory, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [...prev, { sender: "ai", text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
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
          <SidebarItem
            onClick={() => navigate("/settings")}
            icon={<Settings size={20} />}
            text="Settings"
          />
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
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
              />
            </div>

            {/* Interactive Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase hover:ring-2 hover:ring-blue-300 transition-all focus:outline-none overflow-hidden"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userName.charAt(0)
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  {/* Header: User Info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 capitalize">
                      {userName.split("@")[0]}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {userName.includes("@")
                        ? userName
                        : `${userName}@student.edu`}
                    </p>
                  </div>

                  {/* Middle: Navigation Links */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" /> Account
                      Settings
                    </button>

                    <div className="px-4 py-2 text-left text-sm text-slate-700 flex items-center gap-3">
                      <span className="w-4 flex justify-center text-slate-400">
                        👑
                      </span>
                      <span className="flex-1">Current Plan</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Free
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Danger/Logout Zone */}
                  <div className="border-t border-slate-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 capitalize">
                Welcome back, {userName.split("@")[0]}! 👋
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
                      label="Summaries Generated"
                      value={progressStats.summaries_generated}
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

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[300px]">
                  <h3 className="font-bold text-slate-800 mb-4">Daily Goals</h3>

                  <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
                    {goals.length === 0 ? (
                      <p className="text-sm text-slate-400 italic text-center mt-4">
                        No goals yet. Add one below!
                      </p>
                    ) : (
                      goals.map((goal) => (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between group"
                        >
                          <button
                            onClick={() => handleToggleGoal(goal.id)}
                            className="flex items-center gap-3 text-left flex-1"
                          >
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${goal.completed ? "bg-blue-600 border-blue-600" : "border-slate-300 hover:border-blue-400"}`}
                            >
                              {goal.completed && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span
                              className={`text-sm truncate transition-all ${goal.completed ? "text-slate-400 line-through" : "text-slate-700"}`}
                            >
                              {goal.text}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddGoal} className="mt-auto relative">
                    <input
                      type="text"
                      placeholder="Add a new goal..."
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newGoalText.trim()}
                      className="absolute right-2 top-1.5 text-blue-600 hover:text-blue-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors p-1"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </form>
                </div>
              </div>

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
                  ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <DynamicActivityItem
                        key={activity.id}
                        activity={activity}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      <p>
                        {searchQuery
                          ? `No results found for "${searchQuery}"`
                          : "No recent activity found. Generate a quiz or summary to get started!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 👇 --- FLOATING CHAT WIDGET ADDED HERE --- 👇 */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
          
          {/* Chat Box (Shows when open) */}
          {isChatOpen && (
            <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-slate-200 mb-4 overflow-hidden flex flex-col h-[450px] transition-all">
              {/* Header */}
              <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 font-bold">
                  <BrainCircuit size={18} /> Quick Assistant
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:text-blue-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="p-3 border-t border-slate-100 bg-white">
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything..." 
                    className="flex-1 bg-slate-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Circular Floating Toggle Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110 ${isChatOpen ? "bg-slate-800" : "bg-blue-600"}`}
          >
            {isChatOpen ? <X size={24} /> : <MessageCircle size={28} />}
          </button>
        </div>
        {/*  END OF WIDGET */}
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
      className="cursor-pointer hover:shadow-md flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all bg-slate-50/50"
    >
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
