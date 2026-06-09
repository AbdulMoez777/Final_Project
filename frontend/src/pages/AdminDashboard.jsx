import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Trash2, LogOut, Users, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // 1. Fetch Users when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // 2. Delete User Function
  const handleDelete = async (userId) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert("User deleted!");
        fetchUsers(); // Refresh the table
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error connecting to server");
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> Admin Panel
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl text-white font-medium">
             <Users size={20} /> User Management
          </div>
        </nav>
        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl w-full transition-colors font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Registered Users</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-700">ID</th>
                <th className="p-4 font-semibold text-slate-700">Email / Username</th>
                <th className="p-4 font-semibold text-slate-700">Role</th>
                <th className="p-4 font-semibold text-slate-700">Date Joined</th>
                <th className="p-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-500">#{user.id}</td>
                  <td className="p-4 font-medium text-slate-800">{user.username}</td>
                  <td className="p-4">
                    {user.is_staff ? (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Admin</span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">Student</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {!user.is_staff && ( // Don't allow deleting admins here for safety
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete User"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
             <div className="p-8 text-center text-slate-500">No users found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;