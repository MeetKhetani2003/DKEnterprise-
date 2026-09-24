"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export function AdminsTab() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        fetchAdmins();
        setFormData({ username: "", password: "" });
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create admin");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  if (loading) return <div>Loading admins...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Manage Admins</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
        >
          <Plus size={16} /> Add Admin
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-slate-900">New Admin Account</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">
              <X size={20} />
            </button>
          </div>
          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input type="text" required name="username" value={formData.username} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="text" required name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 h-[42px]">
              Create Admin
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{admin.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-slate-500">No admins found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
