import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Trash2, AlertTriangle, Loader2, Edit2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
          setNewName(data.name); // Set the name input default
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

  const handleSaveName = async () => {
    if (!newName.trim()) return; 
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PUT',
        headers: { 
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });

      if (response.ok) {
        setProfile({ ...profile, name: newName });
        setIsEditingName(false);
      } else {
        alert("Failed to update name.");
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This will permanently delete your account, all your quizzes, flashcards, and summaries. This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });

      if (response.ok) {
        alert("Your account has been deleted.");
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  if (isLoading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">
        
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">Settings & Profile</h1>

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
          
          {/* 👇 UPDATED: Avatar Uploader Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              {/* Show the uploaded image OR the default letter/icon */}
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" 
                />
              ) : (
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl uppercase border-4 border-white shadow-md">
                  {profile?.name ? profile.name.charAt(0) : <User size={32} />}
                </div>
              )}
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                id="avatarUpload" 
                className="hidden" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // Use FormData to send files to Django safely
                  const formData = new FormData();
                  formData.append('profile_picture', file);

                  const token = localStorage.getItem('token');
                  const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'PUT',
                    headers: { 'Authorization': `Token ${token}` },
                    body: formData
                  });

                  if (response.ok) {
                    const updatedData = await response.json();
                    window.location.reload(); // Refresh to show the new image instantly
                  } else {
                    alert("Failed to upload image.");
                  }
                }}
              />
              {/* Clickable Overlay that appears on hover */}
              <label htmlFor="avatarUpload" className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Edit2 size={20} className="text-white" />
              </label>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-slate-900">Account Details</h2>
              <p className="text-slate-500">Manage your personal information</p>
            </div>
          </div>
          {/* 👆 END Avatar Uploader Section */}
          
          <div className="space-y-4">
            {/* Display Name Row with Edit Feature */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
              <span className="text-slate-500 font-medium w-32">Display Name</span>
              
              {isEditingName ? (
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={isSaving} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button onClick={() => { setIsEditingName(false); setNewName(profile.name); }} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-bold text-slate-800 capitalize">{profile?.name}</span>
                  <button onClick={() => setIsEditingName(true)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="font-bold text-slate-800">{profile?.email}</span>
            </div>
            <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">Member Since</span>
              <span className="font-bold text-slate-800">{profile?.date_joined}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xl mb-2">
            <AlertTriangle size={24} /> Danger Zone
          </div>
          <p className="text-red-800/70 mb-6">
            Permanently delete your account and all of your generated study materials. This action is irreversible.
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