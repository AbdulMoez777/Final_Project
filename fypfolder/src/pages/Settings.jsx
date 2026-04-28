import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the user's profile data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await fetch("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("DJANGO SENT:", data);
          setProfile(data);
        } else {
          console.error("DJANGO ERROR STATUS:", response.status);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // 2. The function to delete the account
  const handleDeleteAccount = async () => {
    // Double check that they actually want to do this!
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This will permanently delete your account, all your quizzes, flashcards, and summaries. This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/profile/", {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        alert("Your account has been deleted.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">Settings & Profile</h1>

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Account Details
              </h2>
              <p className="text-slate-500">Manage your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="font-bold text-slate-800">{profile?.email}</span>
            </div>
            <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Member Since</span>
              <span className="font-bold text-slate-800">
                {profile?.date_joined}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xl mb-2">
            <AlertTriangle size={24} /> Danger Zone
          </div>
          <p className="text-red-800/70 mb-6">
            Permanently delete your account and all of your generated study
            materials. This action is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm hover:shadow-md"
          >
            <Trash2 size={18} /> Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
