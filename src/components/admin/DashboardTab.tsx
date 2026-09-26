"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileSpreadsheet, CheckCircle, XCircle, Trophy, IndianRupee, Download } from "lucide-react";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#64748b"]; // emerald, red, amber, slate

export function DashboardTab() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");


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

  if (loading) return <div className="text-slate-500">Loading dashboard...</div>;

  // Filter tenders by date
  const filteredTenders = tenders.filter(tender => {
    const tenderDate = tender.tenderLastDate ? new Date(tender.tenderLastDate).getTime() : 0;
    const matchesStartDate = !filterStartDate || tenderDate >= new Date(filterStartDate).getTime();
    const matchesEndDate = !filterEndDate || tenderDate <= new Date(filterEndDate).getTime();
    return matchesStartDate && matchesEndDate;
  });

  // Calculate stats
  const totalTenders = filteredTenders.filter(t => t.filed === "YES").length;
  const overallTotal = filteredTenders.length;

  const exportToCSV = () => {
    if (filteredTenders.length === 0) {
      alert("No data to export");
      return;
    }
    
    // Define headers
    const headers = [
      "Companies",
      "Tender No",
      "Department/Org",
      "Tender Last Date",
      "Bid Closing Time",
      "Location",
      "Category",
      "Contract Period (Year)",
      "Manpower",
      "Bid Value",
      "Filed",
      "Technical Status",
      "Award",
      "EMD Value",
      "EMD Exemption",
      "MSE Purchase Preference",
      "Turnover/Experience Exemption",
      "Office Documents",
      "Is Deleted",
      "Delete Reason",
      "Created At"
    ];
    
    // Create rows
    const rows = filteredTenders.map(t => [
      `"${(Array.isArray(t.companies) ? t.companies.join(", ") : t.companies || '').toString().replace(/"/g, '""')}"`,
      `"${(t.tenderNo || '').toString().replace(/"/g, '""')}"`,
      `"${(t.departmentOrg || '').toString().replace(/"/g, '""')}"`,
      `"${(t.tenderLastDate || '').toString().replace(/"/g, '""')}"`,
      `"${(t.bidClosingTime || '').toString().replace(/"/g, '""')}"`,
      `"${(t.location || '').toString().replace(/"/g, '""')}"`,
      `"${(t.category || '').toString().replace(/"/g, '""')}"`,
      `"${(t.contractPeriodYear || '').toString().replace(/"/g, '""')}"`,
      `"${(t.manpower || '').toString().replace(/"/g, '""')}"`,
      `"${(t.bidValue || '').toString().replace(/"/g, '""')}"`,
      `"${(t.filed || '').toString().replace(/"/g, '""')}"`,
      `"${(t.technicalStatus || '').toString().replace(/"/g, '""')}"`,
      `"${(t.award || '').toString().replace(/"/g, '""')}"`,
      `"${(t.emdValue || '').toString().replace(/"/g, '""')}"`,
      `"${(t.emdExemption || '').toString().replace(/"/g, '""')}"`,
      `"${(t.msePurchasePreference || '').toString().replace(/"/g, '""')}"`,
      `"${(t.turnoverExperienceExemption || '').toString().replace(/"/g, '""')}"`,
      `"${(t.officeDocuments || '').toString().replace(/"/g, '""')}"`,
      `"${(t.isDeleted || '').toString().replace(/"/g, '""')}"`,
      `"${(t.deleteReason || '').toString().replace(/"/g, '""')}"`,
      `"${(t.createdAt ? new Date(t.createdAt).toLocaleString() : '').toString().replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tenders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qualified = filteredTenders.filter(t => t.technicalStatus === "Qualify").length;
  const disqualified = filteredTenders.filter(t => t.technicalStatus === "Disqualify").length;
  const canceled = filteredTenders.filter(t => t.technicalStatus === "Canceled Bid").length;
  const noStatus = filteredTenders.filter(t => !t.technicalStatus || t.technicalStatus === "No Status").length;

  const achieved = filteredTenders.filter(t => t.award === "YES").length;

  const qualifiedRatio = overallTotal > 0 ? ((qualified / overallTotal) * 100).toFixed(1) : "0.0";
  const disqualifiedRatio = overallTotal > 0 ? ((disqualified / overallTotal) * 100).toFixed(1) : "0.0";

  const totalEmdValue = filteredTenders.reduce((acc, curr) => {
    if (curr.emdExemption === "YES" && curr.emdValue) {
      const val = parseFloat(String(curr.emdValue).replace(/,/g, ''));
      if (!isNaN(val)) {
        return acc + val;
      }
    }
    return acc;
  }, 0);

  const formattedEmd = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalEmdValue);

  const pieData = [
    { name: "Qualified", value: qualified },
    { name: "Disqualified", value: disqualified },
    { name: "Canceled", value: canceled },
    { name: "No Status", value: noStatus },
  ].filter(d => d.value > 0);

  // Group by month for BarChart (using tenderLastDate)
  const monthDataMap: { [key: string]: { month: string, Total: number, Qualified: number, Achieved: number } } = {};

  filteredTenders.forEach(t => {
    if (t.tenderLastDate) {
      const date = new Date(t.tenderLastDate);
      if (!isNaN(date.getTime())) {
        const monthYear = date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
        if (!monthDataMap[monthYear]) {
          monthDataMap[monthYear] = { month: monthYear, Total: 0, Qualified: 0, Achieved: 0 };
        }
        monthDataMap[monthYear].Total += 1;
        if (t.technicalStatus === "Qualify") monthDataMap[monthYear].Qualified += 1;
        if (t.award === "YES") monthDataMap[monthYear].Achieved += 1;
      }
    }
  });

  const barData = Object.values(monthDataMap).sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">From Date (Closing Date)</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="w-full border border-slate-300 p-2 rounded text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">To Date (Closing Date)</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="w-full border border-slate-300 p-2 rounded text-sm bg-white"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setFilterStartDate("");
              setFilterEndDate("");
            }}
            className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
          >
            Clear Dates
          </button>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2 shadow-sm shadow-emerald-600/20"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Filed Tenders</p>
            <p className="text-2xl font-bold text-slate-900">{totalTenders}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Qualified / Disqualified Ratio</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              <span className="text-emerald-600">{qualifiedRatio}%</span>
              <span className="text-slate-400 mx-2">/</span>
              <span className="text-red-600">{disqualifiedRatio}%</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total EMD Value</p>
            <p className="text-2xl font-bold text-slate-900">{formattedEmd}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Achieved (Awarded)</p>
            <p className="text-2xl font-bold text-slate-900">{achieved}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Tenders</p>
            <p className="text-2xl font-bold text-slate-900">{noStatus}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Qualified</p>
            <p className="text-2xl font-bold text-slate-900">{qualified}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Disqualified</p>
            <p className="text-2xl font-bold text-slate-900">{disqualified}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Tenders Over Time</h3>
          <div className="h-72">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Qualified" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Achieved" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No date data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Technical Status Breakdown</h3>
          <div className="h-72">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No status data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tenders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Tenders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tender No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Awarded</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTenders.slice(0, 5).map(tender => (
                <tr key={tender._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{tender.tenderNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.departmentOrg}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tender.tenderLastDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tender.technicalStatus === 'Qualify' ? 'bg-green-100 text-green-800' :
                        tender.technicalStatus === 'Disqualify' ? 'bg-red-100 text-red-800' :
                          tender.technicalStatus === 'Canceled Bid' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'}`}>
                      {tender.technicalStatus || 'No Status'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tender.award === 'YES' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                      {tender.award || 'NO'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTenders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">No tenders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
