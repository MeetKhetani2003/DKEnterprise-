"use client";

import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";

export function TendersTab({ role }: { role: string }) {
  const [tenders, setTenders] = useState<any[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenderToDelete, setTenderToDelete] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  
  const [formData, setFormData] = useState<{ companies: string[], [key: string]: any }>({
    companies: [],
    tenderNo: "",
    departmentOrg: "",
    tenderLastDate: "",
    filed: "NO",
    bidClosingTime: "",
    location: "",
    officeDocuments: "",
    msePurchasePreference: "NO",
    category: "",
    contractPeriodYear: "",
    manpower: "",
    emdExemption: "NO",
    emdValue: "",
    turnoverExperienceExemption: "NO",
    bidValue: "",
    technicalStatus: "No Status",
    award: "NO",
  });

  useEffect(() => {
    fetchTenders();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/companies");
      if (res.ok) {
        const data = await res.json();
        setAvailableCompanies(data);
      }
    } catch (error) {
      console.error("Failed to fetch companies", error);
    }
  };

  const toggleCompany = (companyName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      companies: prev.companies.includes(companyName)
        ? prev.companies.filter((c: string) => c !== companyName)
        : [...prev.companies, companyName]
    }));
  };

  const handleAddCompany = async () => {
    if (!newCompany.trim()) return;
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCompany.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableCompanies([...availableCompanies, data.company]);
        setFormData((prev: any) => ({ ...prev, companies: [...prev.companies, data.company.name] }));
        setNewCompany("");
      }
    } catch (error) {
      console.error("Failed to add company", error);
    }
  };

  const fetchTenders = async () => {
    try {
      const res = await fetch("/api/admin/tenders");
      if (res.ok) {
        const data = await res.json();
        setTenders(data);
      }
    } catch (error) {
      console.error("Failed to fetch tenders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTechnicalStatusChange = async (tenderId: string, newStatus: string) => {
    setTenders((prev) =>
      prev.map((t) => (t._id === tenderId ? { ...t, technicalStatus: newStatus } : t))
    );
    try {
      const res = await fetch(`/api/admin/tenders/${tenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicalStatus: newStatus }),
      });
      if (!res.ok) {
        fetchTenders();
      }
    } catch (error) {
      console.error("Failed to update status", error);
      fetchTenders();
    }
  };

  const handleAwardChange = async (tenderId: string, newAward: string) => {
    setTenders((prev) =>
      prev.map((t) => (t._id === tenderId ? { ...t, award: newAward } : t))
    );
    try {
      const res = await fetch(`/api/admin/tenders/${tenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ award: newAward }),
      });
      if (!res.ok) {
        fetchTenders();
      }
    } catch (error) {
      console.error("Failed to update award", error);
      fetchTenders();
    }
  };

  const handleDeleteTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenderToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/tenders/${tenderToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason }),
      });
      if (res.ok) {
        setShowDeleteModal(false);
        setTenderToDelete(null);
        setDeleteReason("");
        fetchTenders();
      }
    } catch (error) {
      console.error("Failed to delete tender", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        fetchTenders();
        // Reset form
        setFormData({
          companies: [], tenderNo: "", departmentOrg: "", tenderLastDate: "", filed: "NO", bidClosingTime: "", location: "", officeDocuments: "", msePurchasePreference: "NO", category: "", contractPeriodYear: "", manpower: "", emdExemption: "NO", emdValue: "", turnoverExperienceExemption: "NO", bidValue: "", technicalStatus: "No Status", award: "NO",
        });
      }
    } catch (error) {
      console.error("Failed to create tender", error);
    }
  };

  if (loading) return <div>Loading tenders...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Tenders</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
        >
          <Plus size={16} /> Add Tender
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-slate-900">New Tender Form</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fields matching the image exactly */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">COMPANIES</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {availableCompanies.map(c => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => toggleCompany(c.name)}
                    className={`px-3 py-1 text-sm rounded-full border ${formData.companies.includes(c.name) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="Add new company..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="flex-1 border p-2 rounded text-sm"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompany(); } }}
                />
                <button type="button" onClick={handleAddCompany} className="bg-slate-200 px-4 py-2 rounded text-sm hover:bg-slate-300">Add</button>
              </div>
            </div>
            <div><label className="block text-sm">TENDER NO</label><input required name="tenderNo" value={formData.tenderNo} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">DEPARTMENT/ORG</label><input required name="departmentOrg" value={formData.departmentOrg} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">TENDER LAST DATE</label><input type="date" required name="tenderLastDate" value={formData.tenderLastDate} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">FILED</label><select name="filed" value={formData.filed} onChange={handleChange} className="w-full border p-2 rounded"><option value="YES">YES</option><option value="NO">NO</option></select></div>
            <div><label className="block text-sm">BID CLOSING TIME</label><input type="time" required name="bidClosingTime" value={formData.bidClosingTime} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">LOCATION</label><input required name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">OFFICE/DOCUMENTS</label><input required name="officeDocuments" value={formData.officeDocuments} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">MSE PURCHASE PREFERENCE</label><select name="msePurchasePreference" value={formData.msePurchasePreference} onChange={handleChange} className="w-full border p-2 rounded"><option value="YES">YES</option><option value="NO">NO</option></select></div>
            <div><label className="block text-sm">CATEGORY</label><input required name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">CONTRACT PERIOD YEAR</label><input required name="contractPeriodYear" value={formData.contractPeriodYear} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">MANPOWER</label><input required name="manpower" value={formData.manpower} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm">EMD</label><select name="emdExemption" value={formData.emdExemption} onChange={handleChange} className="w-full border p-2 rounded"><option value="YES">YES</option><option value="NO">NO</option></select></div>
            {formData.emdExemption === "YES" && (
              <div><label className="block text-sm">EMD VALUE</label><input required name="emdValue" value={formData.emdValue} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            )}
            <div><label className="block text-sm">TURNOVER/EXPERIENCE EXEMPTION</label><select name="turnoverExperienceExemption" value={formData.turnoverExperienceExemption} onChange={handleChange} className="w-full border p-2 rounded"><option value="YES">YES</option><option value="NO">NO</option></select></div>
            <div><label className="block text-sm">BID VALUE</label><input required name="bidValue" value={formData.bidValue} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800">
                Submit Tender
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tender No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Filed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bid Closing</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Office/Docs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">MSE Pref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contract Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Manpower</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">EMD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">EMD Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Turnover Exempt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bid Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Technical Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bid Award</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {tenders.map((tender) => (
              <tr key={tender._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{tender.companies?.join(", ") || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.tenderNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.departmentOrg}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.tenderLastDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.filed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.bidClosingTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.officeDocuments}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.msePurchasePreference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.contractPeriodYear}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.manpower}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.emdExemption}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.emdExemption === 'YES' ? tender.emdValue : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.turnoverExperienceExemption}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.bidValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <select
                    value={tender.technicalStatus || "No Status"}
                    onChange={(e) => handleTechnicalStatusChange(tender._id, e.target.value)}
                    className="border p-1 rounded bg-slate-50"
                  >
                    <option value="No Status">No Status</option>
                    <option value="Qualify">Qualify</option>
                    <option value="Disqualify">Disqualify</option>
                    <option value="Canceled Bid">Canceled Bid</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <select
                    value={tender.award || "NO"}
                    onChange={(e) => handleAwardChange(tender._id, e.target.value)}
                    className="border p-1 rounded bg-slate-50"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.createdBy?.username || "Unknown"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <button 
                    onClick={() => { setTenderToDelete(tender._id); setShowDeleteModal(true); }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Tender"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {tenders.length === 0 && (
              <tr>
                <td colSpan={20} className="px-6 py-4 text-center text-sm text-slate-500">No tenders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Tender</h3>
            <form onSubmit={handleDeleteTender}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for deletion (Required)</label>
                <textarea
                  required
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  placeholder="Please specify why this record is being deleted..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setTenderToDelete(null); setDeleteReason(""); }}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
