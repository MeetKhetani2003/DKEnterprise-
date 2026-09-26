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
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
      const method = editingId ? "PUT" : "POST";
      
      // If editing and password is empty, don't send password
      const bodyPayload = { ...formData };
      if (editingId && !bodyPayload.password) {
        delete (bodyPayload as any).password;
      }
      
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        fetchAdmins();
        setFormData({ username: "", password: "" });
      } else {
        const data = await res.json();
        setError(data.message || (editingId ? "Failed to update admin" : "Failed to create admin"));
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  const handleEdit = (admin: any) => {
    setFormData({ username: admin.username, password: "" });
    setEditingId(admin._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      alert("An unexpected error occurred");
    }
  };

  if (loading) return <div>Loading admins...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Manage Admins</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ username: "", password: "" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
        >
          <Plus size={16} /> Add Admin
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-slate-900">{editingId ? "Edit Admin Account" : "New Admin Account"}</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-slate-500 hover:text-slate-700">
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
              <label className="block text-sm font-medium mb-1">Password {editingId && <span className="text-slate-400 font-normal text-xs">(leave blank to keep current)</span>}</label>
              <input type="text" required={!editingId} name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 h-[42px]">
              {editingId ? "Update Admin" : "Create Admin"}
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
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{admin.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(admin)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(admin._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">No admins found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
