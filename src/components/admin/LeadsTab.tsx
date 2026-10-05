"use client";

import { useState, useEffect } from "react";
import { Plus, X, Trash2, Edit2, Search } from "lucide-react";

export function LeadsTab({ role }: { role: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [formError, setFormError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    accountName: "",
    vertical: "",
    location: "",
    facilityType: "",
    decisionMaker: "",
    contact: "",
    currentVendor: "",
    contractExpiry: "",
    estimatedManpower: "",
    estimatedAnnualValue: "",
    stage: "",
    nextAction: "",
    nextActionDate: "",
    probability: "",
    competitors: "",
    paymentTerms: "",
    risks: "",
    owner: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/leads/${leadToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason }),
      });
      if (res.ok) {
        setShowDeleteModal(false);
        setLeadToDelete(null);
        setDeleteReason("");
        fetchLeads();
      }
    } catch (error) {
      console.error("Failed to delete lead", error);
    }
  };

  const handleEditClick = (lead: any) => {
    setEditingLeadId(lead._id);
    setFormData({
      accountName: lead.accountName || "",
      vertical: lead.vertical || "",
      location: lead.location || "",
      facilityType: lead.facilityType || "",
      decisionMaker: lead.decisionMaker || "",
      contact: lead.contact || "",
      currentVendor: lead.currentVendor || "",
      contractExpiry: lead.contractExpiry || "",
      estimatedManpower: lead.estimatedManpower || "",
      estimatedAnnualValue: lead.estimatedAnnualValue || "",
      stage: lead.stage || "",
      nextAction: lead.nextAction || "",
      nextActionDate: lead.nextActionDate || "",
      probability: lead.probability || "",
      competitors: lead.competitors || "",
      paymentTerms: lead.paymentTerms || "",
      risks: lead.risks || "",
      owner: lead.owner || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const url = editingLeadId ? `/api/admin/leads/${editingLeadId}` : "/api/admin/leads";
      const method = editingLeadId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setShowForm(false);
        setEditingLeadId(null);
        fetchLeads();
        // Reset form
        setFormData({
          accountName: "", vertical: "", location: "", facilityType: "", decisionMaker: "", contact: "", currentVendor: "", contractExpiry: "", estimatedManpower: "", estimatedAnnualValue: "", stage: "", nextAction: "", nextActionDate: "", probability: "", competitors: "", paymentTerms: "", risks: "", owner: ""
        });
      } else {
        const data = await res.json();
        setFormError(data.message || "Failed to save lead");
      }
    } catch (error) {
      console.error("Failed to save lead", error);
      setFormError("An unexpected error occurred");
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchSearch = Object.values(lead).some(
      val => typeof val === "string" && val.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchSearch;
  });

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading leads...</div>;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => {
            setEditingLeadId(null);
            setFormData({
              accountName: "", vertical: "", location: "", facilityType: "", decisionMaker: "", contact: "", currentVendor: "", contractExpiry: "", estimatedManpower: "", estimatedAnnualValue: "", stage: "", nextAction: "", nextActionDate: "", probability: "", competitors: "", paymentTerms: "", risks: "", owner: ""
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm text-left">
          <thead className="bg-zinc-50 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Account Name</th>
              <th className="px-6 py-4">Vertical</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Next Action Date</th>
              <th className="px-6 py-4">Est. Value</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {filteredLeads.map((lead) => (
              <tr key={lead._id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{lead.accountName}</td>
                <td className="px-6 py-4 text-zinc-600">{lead.vertical}</td>
                <td className="px-6 py-4 text-zinc-600">{lead.stage}</td>
                <td className="px-6 py-4 text-zinc-600">{lead.nextActionDate}</td>
                <td className="px-6 py-4 text-zinc-600">{lead.estimatedAnnualValue}</td>
                <td className="px-6 py-4 text-zinc-600">{lead.owner}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => handleEditClick(lead)} className="text-zinc-400 hover:text-blue-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setLeadToDelete(lead._id); setShowDeleteModal(true); }} className="text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  No leads found. Click "Add New Lead" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="text-lg font-bold text-zinc-900">{editingLeadId ? "Edit Lead" : "Add New Lead"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  {formError}
                </div>
              )}

              <form id="leadForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { name: "accountName", label: "Account Name", placeholder: "e.g. ABC Manufacturing Pvt Ltd" },
                  { name: "vertical", label: "Vertical", placeholder: "e.g. Industrial" },
                  { name: "location", label: "Location", placeholder: "e.g. Sanand-II" },
                  { name: "facilityType", label: "Facility Type", placeholder: "e.g. Factory + warehouse" },
                  { name: "decisionMaker", label: "Decision Maker", placeholder: "e.g. Plant/Admin Head" },
                  { name: "contact", label: "Contact", placeholder: "Name / phone / email" },
                  { name: "currentVendor", label: "Current Vendor", placeholder: "Known / unknown" },
                  { name: "contractExpiry", label: "Contract Expiry", placeholder: "Date / unknown" },
                  { name: "estimatedManpower", label: "Estimated Manpower", placeholder: "e.g. 25" },
                  { name: "estimatedAnnualValue", label: "Estimated Annual Value", placeholder: "e.g. ₹___" },
                  { name: "stage", label: "Stage", placeholder: "e.g. Site Survey" },
                  { name: "nextAction", label: "Next Action", placeholder: "e.g. Proposal by Friday" },
                  { name: "nextActionDate", label: "Next Action Date", placeholder: "DD/MM/YYYY" },
                  { name: "probability", label: "Probability", placeholder: "Internal estimate only" },
                  { name: "competitors", label: "Competitors", placeholder: "Known / unknown" },
                  { name: "paymentTerms", label: "Payment Terms", placeholder: "___ days" },
                  { name: "risks", label: "Risks", placeholder: "Eligibility / price / incumbent" },
                  { name: "owner", label: "Owner", placeholder: "BD executive" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input 
                      type="text"
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                ))}
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all">
                Cancel
              </button>
              <button type="submit" form="leadForm" className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm">
                {editingLeadId ? "Save Changes" : "Create Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 mx-auto">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 text-center mb-2">Delete Lead</h3>
              <p className="text-sm text-zinc-500 text-center mb-6">Are you sure you want to delete this lead? This action cannot be undone.</p>
              
              <form onSubmit={handleDeleteLead}>
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">Reason for deletion (Optional)</label>
                  <textarea 
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none h-24"
                    placeholder="Enter reason..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm shadow-red-600/20 flex-1">
                    Delete Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
