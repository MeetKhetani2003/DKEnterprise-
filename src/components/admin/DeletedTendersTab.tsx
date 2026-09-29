"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export function DeletedTendersTab({ role }: { role: string }) {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenderToDelete, setTenderToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDeletedTenders();
  }, []);

  const fetchDeletedTenders = async () => {
    try {
      const res = await fetch("/api/admin/tenders/deleted");
      if (res.ok) {
        const data = await res.json();
        setTenders(data);
      }
    } catch (error) {
      console.error("Failed to fetch deleted tenders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermanently = async () => {
    if (!tenderToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/tenders/deleted/${tenderToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowDeleteModal(false);
        setTenderToDelete(null);
        fetchDeletedTenders();
      }
    } catch (error) {
      console.error("Failed to delete tender permanently", error);
    }
  };

  if (loading) return <div>Loading deleted tenders...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Deleted Tenders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tender No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason for Deletion</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deleted By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deleted At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {tenders.map((tender) => (
              <tr key={tender._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 uppercase">{tender.companies?.join(", ") || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 uppercase">{tender.tenderNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 uppercase">{tender.departmentOrg}</td>
                <td className="px-6 py-4 text-sm text-red-600 font-medium">{tender.deleteReason || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.deletedBy?.username || "Unknown"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {tender.deletedAt ? new Date(tender.deletedAt).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setTenderToDelete(tender._id); setShowDeleteModal(true); }}
                      className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                      title="Delete Permanently"
                    >
                      <Trash2 size={16} /> Perm Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tenders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-slate-500">No deleted tenders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Permanently</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to permanently delete this tender? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setTenderToDelete(null); }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePermanently}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
