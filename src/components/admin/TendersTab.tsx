"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export function TendersTab({ role }: { role: string }) {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
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
    turnoverExperienceExemption: "NO",
    bidValue: "",
    gstJsonFileTypeSoftware: "",
  });

  useEffect(() => {
    fetchTenders();
  }, []);

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
          tenderNo: "", departmentOrg: "", tenderLastDate: "", filed: "NO", bidClosingTime: "", location: "", officeDocuments: "", msePurchasePreference: "NO", category: "", contractPeriodYear: "", manpower: "", emdExemption: "NO", turnoverExperienceExemption: "NO", bidValue: "", gstJsonFileTypeSoftware: "",
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
            <div><label className="block text-sm">EMD/EXEMPTION</label><select name="emdExemption" value={formData.emdExemption} onChange={handleChange} className="w-full border p-2 rounded"><option value="YES">YES</option><option value="NO">NO</option></select></div>
            <div><label className="block text-sm">TURNOVER/EXPERIENCE EXEMPTION</label><select name="turnoverExperienceExemption" value={formData.turnoverExperienceExemption} onChange={handleChange} className="w-full border p-2 rounded"><option value="YES">YES</option><option value="NO">NO</option></select></div>
            <div><label className="block text-sm">BID VALUE</label><input required name="bidValue" value={formData.bidValue} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div className="md:col-span-2"><label className="block text-sm">GST JSON FILE TYPE: SOFTWARE</label><input required name="gstJsonFileTypeSoftware" value={formData.gstJsonFileTypeSoftware} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            
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
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">EMD Exempt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Turnover Exempt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bid Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GST JSON</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {tenders.map((tender) => (
              <tr key={tender._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{tender.tenderNo}</td>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.turnoverExperienceExemption}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.bidValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.gstJsonFileTypeSoftware}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.createdBy?.email || "Unknown"}</td>
              </tr>
            ))}
            {tenders.length === 0 && (
              <tr>
                <td colSpan={16} className="px-6 py-4 text-center text-sm text-slate-500">No tenders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
