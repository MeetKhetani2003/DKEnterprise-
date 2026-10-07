"use client";

import { useState, useEffect } from "react";
import { Plus, X, Trash2, Edit2, Search, Building2, BarChart2, Clock, FileText, Trophy, XCircle, MoreVertical, CheckSquare, FilePlus } from "lucide-react";

export function LeadsTab({ role }: { role: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [formError, setFormError] = useState("");
  
  const [selectedLead, setSelectedLead] = useState<any>(null); // For sidebar details
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    let tableHtml = `
      <html>
        <head>
          <title>Leads Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Leads Report</h2>
          ${fromDate || toDate ? `<p>Date Range: ${fromDate || "Beginning"} to ${toDate || "Present"}</p>` : ""}
          <table>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Vertical</th>
                <th>Location</th>
                <th>Stage</th>
                <th>Est. Value</th>
                <th>Next Action Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredLeads.forEach(lead => {
      tableHtml += `
        <tr>
          <td>${lead.accountName || "-"}</td>
          <td>${lead.vertical || "-"}</td>
          <td>${lead.location || "-"}</td>
          <td>${lead.stage || "-"}</td>
          <td>${lead.estimatedAnnualValue || "-"}</td>
          <td>${lead.nextActionDate || "-"}</td>
          <td>${lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
  };

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
        setSelectedLead(null);
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
      stage: lead.stage || "Initial Contact",
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
        if (selectedLead && editingLeadId) {
            const updated = await res.json();
            setSelectedLead(updated.lead || updated); // Update sidebar if it's open
        }
        setFormData({
          accountName: "", vertical: "", location: "", facilityType: "", decisionMaker: "", contact: "", currentVendor: "", contractExpiry: "", estimatedManpower: "", estimatedAnnualValue: "", stage: "Initial Contact", nextAction: "", nextActionDate: "", probability: "", competitors: "", paymentTerms: "", risks: "", owner: ""
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
    let matchDate = true;
    if (fromDate || toDate) {
      if (lead.createdAt) {
        const leadDate = new Date(lead.createdAt).getTime();
        const start = fromDate ? new Date(fromDate).getTime() : 0;
        const end = toDate ? new Date(toDate).getTime() + 86400000 : Infinity; // add 1 day to include end date
        matchDate = leadDate >= start && leadDate <= end;
      } else {
        matchDate = false;
      }
    }

    const matchSearch = Object.values(lead).some(
      val => typeof val === "string" && val.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchSearch && matchDate;
  });

  const getStageStyles = (stage: string) => {
    switch(stage?.toLowerCase()) {
      case "site survey": return "bg-[#e5f0fa] text-[#2c7ae0]";
      case "proposal": return "bg-[#fef1cd] text-[#b68c17]";
      case "follow-up": return "bg-[#eae3fa] text-[#714bd3]";
      case "negotiation": return "bg-[#fbe0df] text-[#d6413a]";
      case "won": return "bg-[#d5f3df] text-[#2e9c52]";
      case "lost": return "bg-[#fbe0df] text-[#d6413a]";
      default: return "bg-zinc-100 text-zinc-600";
    }
  };

  const formatCurrency = (val: string | number) => {
    if (!val) return "";
    const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading leads...</div>;

  const totalOps = leads.length;
  const wonOps = leads.filter(l => l.stage?.toLowerCase() === 'won').length;
  const lostOps = leads.filter(l => l.stage?.toLowerCase() === 'lost').length;
  const activeOps = totalOps - wonOps - lostOps;
  const siteSurveyOps = leads.filter(l => l.stage?.toLowerCase() === 'site survey').length;
  const proposalOps = leads.filter(l => l.stage?.toLowerCase() === 'proposal').length;

  return (
    <div className="flex relative min-h-[calc(100vh-80px)]">
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${selectedLead ? 'pr-[400px]' : ''}`}>
        
        {/* Header & Dashboard Stats */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a2b4b]">CRM — Opportunities</h1>
              <p className="text-zinc-500 text-sm mt-1">Manage and track all corporate, industrial, hospital, mall and private sector opportunities</p>
            </div>
            <button 
              onClick={() => {
                setEditingLeadId(null);
                setFormData({
                  accountName: "", vertical: "", location: "", facilityType: "", decisionMaker: "", contact: "", currentVendor: "", contractExpiry: "", estimatedManpower: "", estimatedAnnualValue: "", stage: "Initial Contact", nextAction: "", nextActionDate: "", probability: "", competitors: "", paymentTerms: "", risks: "", owner: ""
                });
                setShowForm(true);
              }}
              className="bg-[#0f62fe] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} /> Add New Opportunity
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Total Opportunities</p>
                <p className="text-2xl font-bold text-zinc-900">{totalOps}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Active Opportunities</p>
                <p className="text-2xl font-bold text-zinc-900">{activeOps}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-500">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Site Survey</p>
                <p className="text-2xl font-bold text-zinc-900">{siteSurveyOps}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Proposal Stage</p>
                <p className="text-2xl font-bold text-zinc-900">{proposalOps}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Won</p>
                <p className="text-2xl font-bold text-zinc-900">{wonOps}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Lost</p>
                <p className="text-2xl font-bold text-zinc-900">{lostOps}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-fit">
          
          <div className="p-4 border-b border-zinc-200 flex flex-wrap gap-3 items-center bg-white">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text"
                placeholder="Search by account name, location, vertical..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <select className="border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-600 bg-white min-w-[120px] outline-none">
              <option value="">Vertical</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">From:</span>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-zinc-200 rounded-lg px-2 py-1.5 text-sm text-zinc-600 bg-white outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">To:</span>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-zinc-200 rounded-lg px-2 py-1.5 text-sm text-zinc-600 bg-white outline-none" />
            </div>
            <button onClick={() => { setSearchQuery(""); setFromDate(""); setToDate(""); }} className="bg-white border border-zinc-200 text-zinc-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50">Reset</button>
            <button onClick={handleDownloadPDF} className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2 ml-auto shadow-sm">
              <FileText size={16} /> Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#00204a] text-white">
                <tr>
                  <th className="px-4 py-3 w-10 font-medium">#</th>
                  <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-zinc-400" /></th>
                  <th className="px-4 py-3 font-medium">Account Name</th>
                  <th className="px-4 py-3 font-medium">Vertical</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Est. Value</th>
                  <th className="px-4 py-3 font-medium">Next Action</th>
                  <th className="px-4 py-3 font-medium">Next Date</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredLeads.map((lead, idx) => (
                  <tr 
                    key={lead._id} 
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer transition-colors ${selectedLead?._id === lead._id ? 'bg-blue-50/50' : 'hover:bg-zinc-50'}`}
                  >
                    <td className="px-4 py-3.5 text-zinc-500">{idx + 1}</td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-zinc-300" /></td>
                    <td className="px-4 py-3.5 font-medium text-[#0f62fe]">{lead.accountName}</td>
                    <td className="px-4 py-3.5 text-zinc-600">{lead.vertical}</td>
                    <td className="px-4 py-3.5 text-zinc-600">{lead.location}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStageStyles(lead.stage)}`}>
                        {lead.stage || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-900 font-medium">{formatCurrency(lead.estimatedAnnualValue) || "-"}</td>
                    <td className="px-4 py-3.5 text-zinc-600">{lead.nextAction || "-"}</td>
                    <td className="px-4 py-3.5 text-zinc-600">{lead.nextActionDate || "-"}</td>
                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="relative group inline-block">
                        <button className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md">
                          <MoreVertical size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                          <button onClick={() => handleEditClick(lead)} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                            <Edit2 size={14}/> Edit
                          </button>
                          <button onClick={() => { setLeadToDelete(lead._id); setShowDeleteModal(true); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 size={14}/> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-zinc-500">
                      No opportunities found. Click &quot;Add New Opportunity&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-zinc-200 flex items-center justify-between bg-white text-sm text-zinc-500">
            <div>Showing 1 to {filteredLeads.length} of {filteredLeads.length} entries</div>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-zinc-200 hover:bg-zinc-50">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#0f62fe] bg-[#0f62fe] text-white">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-400 cursor-not-allowed">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Opportunity Details */}
      <div 
        className={`fixed top-20 bottom-0 right-0 w-[400px] bg-white border-l border-zinc-200 shadow-2xl transition-transform duration-300 z-30 flex flex-col ${selectedLead ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedLead && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-[#0f62fe]">
                  <Building2 size={18} />
                </div>
                <h3 className="font-bold text-lg text-zinc-900">Opportunity Details</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                {[
                  { label: "Account name", value: selectedLead.accountName },
                  { label: "Vertical", value: selectedLead.vertical },
                  { label: "Location", value: selectedLead.location },
                  { label: "Facility type", value: selectedLead.facilityType },
                  { label: "Decision maker", value: selectedLead.decisionMaker },
                  { label: "Contact", value: selectedLead.contact },
                  { label: "Current vendor", value: selectedLead.currentVendor },
                  { label: "Contract expiry", value: selectedLead.contractExpiry },
                  { label: "Estimated manpower", value: selectedLead.estimatedManpower },
                  { label: "Estimated annual value", value: formatCurrency(selectedLead.estimatedAnnualValue) },
                  { label: "Stage", value: <span className={`px-2.5 py-1 rounded-md text-xs font-medium inline-block ${getStageStyles(selectedLead.stage)}`}>{selectedLead.stage}</span> },
                  { label: "Next action", value: selectedLead.nextAction },
                  { label: "Next action date", value: selectedLead.nextActionDate },
                  { label: "Probability", value: selectedLead.probability },
                  { label: "Competitors", value: selectedLead.competitors },
                  { label: "Payment terms", value: selectedLead.paymentTerms },
                  { label: "Risks", value: selectedLead.risks },
                  { label: "Owner", value: selectedLead.owner },
                ].map((field, i) => (
                  <div key={i} className="flex border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
                    <span className="w-1/2 text-sm text-zinc-500">{field.label}</span>
                    <span className="w-1/2 text-sm font-medium text-zinc-800 break-words">{field.value || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-5 border-t border-zinc-100 bg-zinc-50/50 flex gap-3">
              <button 
                onClick={() => handleEditClick(selectedLead)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0f62fe] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-1 shadow-sm"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#198754] text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex-1 shadow-sm"
              >
                <CheckSquare size={16} /> Add Follow-up
              </button>
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#0f62fe] border border-[#0f62fe] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex-1 shadow-sm"
              >
                <FilePlus size={16} /> Create Proposal
              </button>
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="text-lg font-bold text-zinc-900">{editingLeadId ? "Edit Opportunity" : "Add New Opportunity"}</h3>
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
                  { name: "estimatedAnnualValue", label: "Estimated Annual Value", placeholder: "e.g. 4800000" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input 
                      type="text"
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f62fe] focus:border-transparent outline-none transition-all"
                      required={field.name === "accountName" || field.name === "vertical" || field.name === "location"}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">Stage</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange as any}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f62fe] focus:border-transparent outline-none transition-all"
                  >
                    <option value="Initial Contact">Initial Contact</option>
                    <option value="Site Survey">Site Survey</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                {[
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
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f62fe] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                ))}
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all">
                Cancel
              </button>
              <button type="submit" form="leadForm" className="px-5 py-2.5 text-sm font-medium text-white bg-[#0f62fe] hover:bg-blue-700 rounded-xl transition-all shadow-sm">
                {editingLeadId ? "Save Changes" : "Create Opportunity"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 mx-auto">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 text-center mb-2">Delete Opportunity</h3>
              <p className="text-sm text-zinc-500 text-center mb-6">Are you sure you want to delete this opportunity? This action cannot be undone.</p>
              
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
