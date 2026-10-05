"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Building2, Users, FileText, Check, FileJson, List, Eye, X } from "lucide-react";

type Company = {
  id: string;
  name: string;
  gstin: string;
  stateCode: string; // Stcd
  pinCode: string;
  address: string;
  location: string;
};

type Buyer = {
  id: string;
  name: string;
  gstin: string;
  stateCode: string; // Stcd and Pos
  pinCode: string;
  address: string;
  location: string;
  companyId?: string;
};

type InvoiceItem = {
  description: string;
  hsnCode: string;
  supplyType: "Goods" | "Services";
  taxableAmount: number;
};

type SavedInvoice = {
  id: string;
  invoiceNo: string;
  date: string;
  sellerName: string;
  buyerName: string;
  totalAmount: number;
  jsonOutput: any;
};

export function EInvoiceTab() {
  const [activeSubTab, setActiveSubTab] = useState<"create" | "companies" | "buyers" | "history">("create");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCompanies = localStorage.getItem("einvoice_companies");
    if (savedCompanies && savedCompanies !== "[]") {
      setCompanies(JSON.parse(savedCompanies));
    } else {
      setCompanies([
        {
          id: "test-seller-1",
          name: "D K ENTERPRISE",
          gstin: "24BQRPV1727M1Z4",
          stateCode: "24",
          pinCode: "360005",
          address: "Office No- 409,Vyanktesh Vogue,150 Feet Ring Road,Indira Circle",
          location: "Rajkot"
        }
      ]);
    }

    const savedBuyers = localStorage.getItem("einvoice_buyers");
    if (savedBuyers && savedBuyers !== "[]") {
      setBuyers(JSON.parse(savedBuyers));
    } else {
      setBuyers([
        {
          id: "test-buyer-1",
          name: "GSPL INDIA GASNET LTD",
          gstin: "03AAECG4433G1Z1",
          stateCode: "03",
          pinCode: "143001",
          address: "393, Garden Enclave,khankot Garden colony,GT Road by pass,",
          location: "Amritsar"
        }
      ]);
    }

    const savedInvoices = localStorage.getItem("einvoice_history");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("einvoice_companies", JSON.stringify(companies));
    }
  }, [companies, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("einvoice_buyers", JSON.stringify(buyers));
    }
  }, [buyers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("einvoice_history", JSON.stringify(invoices));
    }
  }, [invoices, isLoaded]);

  const [selectedInvoice, setSelectedInvoice] = useState<SavedInvoice | null>(null);

  // History Filters
  const [historyFilterMonth, setHistoryFilterMonth] = useState("");
  const [historyFilterDate, setHistoryFilterDate] = useState("");
  const [historyFilterBuyer, setHistoryFilterBuyer] = useState("ALL");

  // Invoice Form State
  const [selectedCompanyId, setSelectedCompanyId] = useState("test-seller-1");
  const [selectedBuyerId, setSelectedBuyerId] = useState("test-buyer-1");
  const [invoiceNo, setInvoiceNo] = useState("GIGL/PUN/021");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "HOUSEKEEPING SERVICES AT AMRITSAR & BHATINDA BASE", hsnCode: "998533", supplyType: "Services", taxableAmount: 396722.0 }
  ]);

  // Handle item change
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", hsnCode: "", supplyType: "Services", taxableAmount: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Generate JSON
  const generateJSON = () => {
    const seller = companies.find((c) => c.id === selectedCompanyId);
    const buyer = buyers.find((b) => b.id === selectedBuyerId);

    if (!seller || !buyer) {
      alert("Please select both Seller (Company) and Buyer.");
      return;
    }
    if (!invoiceNo || !invoiceDate) {
      alert("Please enter Invoice No and Date.");
      return;
    }

    let totalAssVal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalInvVal = 0;

    const itemList = items.map((item, index) => {
      const isInterState = seller.stateCode !== buyer.stateCode;
      const gstRate = 18; // Assuming 18% standard
      
      let cgstAmt = 0;
      let sgstAmt = 0;
      let igstAmt = 0;

      if (isInterState) {
        igstAmt = Number(((item.taxableAmount * gstRate) / 100).toFixed(2));
      } else {
        cgstAmt = Number(((item.taxableAmount * (gstRate / 2)) / 100).toFixed(2));
        sgstAmt = Number(((item.taxableAmount * (gstRate / 2)) / 100).toFixed(2));
      }

      const totItemVal = item.taxableAmount + cgstAmt + sgstAmt + igstAmt;

      totalAssVal += item.taxableAmount;
      totalCgst += cgstAmt;
      totalSgst += sgstAmt;
      totalIgst += igstAmt;
      totalInvVal += totItemVal;

      return {
        SlNo: String(index + 1),
        PrdDesc: item.description,
        IsServc: item.supplyType === "Services" ? "Y" : "N",
        HsnCd: item.hsnCode,
        Qty: 1,
        Unit: "OTH",
        UnitPrice: item.taxableAmount,
        TotAmt: item.taxableAmount,
        AssAmt: item.taxableAmount,
        GstRt: gstRate,
        IgstAmt: igstAmt,
        CgstAmt: cgstAmt,
        SgstAmt: sgstAmt,
        TotItemVal: Math.round(totItemVal * 100) / 100
      };
    });

    const valDtls = {
      AssVal: totalAssVal,
      CgstVal: totalCgst,
      SgstVal: totalSgst,
      IgstVal: totalIgst,
      RndOffAmt: 0,
      TotInvVal: Math.round(totalInvVal)
    };

    // Calculate rounding difference if needed
    const actualTotal = totalAssVal + totalCgst + totalSgst + totalIgst;
    valDtls.RndOffAmt = Number((valDtls.TotInvVal - actualTotal).toFixed(2));

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = invoiceDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const invoiceJson = {
      Version: "1.1",
      TranDtls: {
        TaxSch: "GST",
        SupTyp: "B2B"
      },
      DocDtls: {
        Typ: "INV",
        No: invoiceNo,
        Dt: formattedDate
      },
      SellerDtls: {
        Gstin: seller.gstin,
        LglNm: seller.name,
        Addr1: seller.address,
        Loc: seller.location,
        Pin: Number(seller.pinCode),
        Stcd: seller.stateCode
      },
      BuyerDtls: {
        Gstin: buyer.gstin,
        LglNm: buyer.name,
        Pos: buyer.stateCode,
        Addr1: buyer.address,
        Loc: buyer.location,
        Pin: Number(buyer.pinCode),
        Stcd: buyer.stateCode
      },
      ItemList: itemList,
      ValDtls: valDtls
    };

    // Make it an array to match the requested output format
    const output = [invoiceJson];

    // Save to history
    const newInvoiceRecord: SavedInvoice = {
      id: Date.now().toString(),
      invoiceNo: invoiceNo,
      date: formattedDate,
      sellerName: seller.name,
      buyerName: buyer.name,
      totalAmount: Math.round(totalInvVal),
      jsonOutput: output
    };
    setInvoices(prev => [newInvoiceRecord, ...prev]);

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${invoiceNo}_einvoice.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Reset form and switch to history tab
    setSelectedCompanyId("");
    setSelectedBuyerId("");
    setInvoiceNo("");
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setItems([{ description: "", hsnCode: "", supplyType: "Services", taxableAmount: 0 }]);
    setActiveSubTab("history");
  };

  // Filtered History
  const filteredInvoices = invoices.filter(inv => {
    let matchBuyer = true;
    let matchMonth = true;
    let matchDate = true;

    if (historyFilterBuyer !== "ALL") {
      matchBuyer = inv.buyerName === historyFilterBuyer;
    }
    
    if (historyFilterMonth) {
      const [year, month] = historyFilterMonth.split("-");
      const invParts = inv.date.split("/"); // [DD, MM, YYYY]
      if (invParts.length === 3) {
        matchMonth = invParts[1] === month && invParts[2] === year;
      }
    }

    if (historyFilterDate) {
      const [year, month, day] = historyFilterDate.split("-");
      const invParts = inv.date.split("/");
      if (invParts.length === 3) {
        matchDate = invParts[0] === day && invParts[1] === month && invParts[2] === year;
      }
    }

    return matchBuyer && matchMonth && matchDate;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden min-h-[600px] flex flex-col">
      <div className="flex border-b border-zinc-200 bg-zinc-50">
        <button
          onClick={() => setActiveSubTab("create")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeSubTab === "create" ? "bg-white text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          <FileText size={18} />
          Create Invoice
        </button>
        <button
          onClick={() => setActiveSubTab("companies")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeSubTab === "companies" ? "bg-white text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          <Building2 size={18} />
          Manage Companies
        </button>
        <button
          onClick={() => setActiveSubTab("buyers")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeSubTab === "buyers" ? "bg-white text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          <Users size={18} />
          Manage Buyers
        </button>
        <button
          onClick={() => setActiveSubTab("history")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeSubTab === "history" ? "bg-white text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          <List size={18} />
          Invoice History
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeSubTab === "create" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
              <div className="space-y-4">
                <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
                  <Building2 size={18} className="text-primary" />
                  Seller Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Select Company</label>
                  <select 
                    className="w-full rounded-lg border-zinc-300 border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.gstin})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Buyer Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Select Buyer</label>
                  <select 
                    className="w-full rounded-lg border-zinc-300 border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                    value={selectedBuyerId}
                    onChange={(e) => setSelectedBuyerId(e.target.value)}
                  >
                    <option value="">-- Select Buyer --</option>
                    {buyers.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.gstin})</option>
                    ))}
                  </select>
                </div>
                {selectedBuyerId && (
                  <div className="bg-white p-3 rounded-md text-xs text-zinc-600 border border-zinc-200">
                    {(() => {
                      const b = buyers.find(x => x.id === selectedBuyerId);
                      return b ? (
                        <>
                          <p><strong>Name:</strong> {b.name}</p>
                          <p><strong>GSTIN:</strong> {b.gstin}</p>
                          <p><strong>Address:</strong> {b.address}, {b.location}, {b.stateCode} - {b.pinCode}</p>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Invoice No.</label>
                <input 
                  type="text" 
                  placeholder="e.g. GIGL/PUN/021"
                  className="w-full rounded-lg border-zinc-300 border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Invoice Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-lg border-zinc-300 border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-800">Invoice Items</h3>
                <button 
                  onClick={addItem}
                  className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium hover:bg-primary/20 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-start bg-zinc-50 p-4 rounded-xl border border-zinc-200 relative">
                    {items.length > 1 && (
                      <button 
                        onClick={() => removeItem(index)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Description / Item</label>
                      <input 
                        type="text" 
                        placeholder="e.g. HOUSEKEEPING SERVICES..."
                        className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm focus:ring-primary"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      />
                    </div>
                    <div className="w-[120px]">
                      <label className="block text-xs font-medium text-zinc-500 mb-1">HSN/SAC</label>
                      <input 
                        type="text" 
                        placeholder="998533"
                        className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm focus:ring-primary"
                        value={item.hsnCode}
                        onChange={(e) => handleItemChange(index, "hsnCode", e.target.value)}
                      />
                    </div>
                    <div className="w-[120px]">
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Type</label>
                      <select 
                        className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm focus:ring-primary"
                        value={item.supplyType}
                        onChange={(e) => handleItemChange(index, "supplyType", e.target.value)}
                      >
                        <option value="Services">Services</option>
                        <option value="Goods">Goods</option>
                      </select>
                    </div>
                    <div className="w-[150px]">
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Taxable Amount</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm focus:ring-primary"
                        value={item.taxableAmount || ""}
                        onChange={(e) => handleItemChange(index, "taxableAmount", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-zinc-200">
              <button 
                onClick={generateJSON}
                className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <FileJson size={20} />
                Generate & Download JSON
              </button>
              <p className="text-xs text-zinc-500 mt-3 text-center md:text-left">
                * GST (18%) is automatically calculated as CGST+SGST or IGST based on the state code of Seller and Buyer.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === "companies" && (
          <EntityManager 
            title="Company"
            entities={companies}
            setEntities={setCompanies}
          />
        )}

        {activeSubTab === "buyers" && (
          <EntityManager 
            title="Buyer"
            entities={buyers}
            setEntities={setBuyers}
            companies={companies}
          />
        )}

        {activeSubTab === "history" && (
          <div className="max-w-5xl mx-auto">
            <h3 className="font-semibold text-zinc-900 mb-6 flex items-center gap-2">
              <List size={20} className="text-primary" />
              Generated Invoices History
            </h3>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Filter by Month</label>
                  <input 
                    type="month" 
                    value={historyFilterMonth}
                    onChange={(e) => setHistoryFilterMonth(e.target.value)}
                    className="w-full border-zinc-300 border rounded-lg px-3 py-2 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Filter by Date</label>
                  <input 
                    type="date" 
                    value={historyFilterDate}
                    onChange={(e) => setHistoryFilterDate(e.target.value)}
                    className="w-full border-zinc-300 border rounded-lg px-3 py-2 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Filter by Buyer</label>
                  <select
                    value={historyFilterBuyer}
                    onChange={(e) => setHistoryFilterBuyer(e.target.value)}
                    className="w-full border-zinc-300 border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="ALL">All Buyers</option>
                    {Array.from(new Set(invoices.map(inv => inv.buyerName))).map(buyerName => (
                      <option key={buyerName} value={buyerName}>{buyerName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setHistoryFilterMonth("");
                      setHistoryFilterDate("");
                      setHistoryFilterBuyer("ALL");
                    }}
                    className="w-full px-4 py-2 text-sm bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
                No invoices generated yet.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-600">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-700 uppercase">
                    <tr>
                      <th className="px-6 py-4">Invoice No</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Seller</th>
                      <th className="px-6 py-4">Buyer</th>
                      <th className="px-6 py-4">Total Amount</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-900">{inv.invoiceNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{inv.date}</td>
                        <td className="px-6 py-4">{inv.sellerName}</td>
                        <td className="px-6 py-4">{inv.buyerName}</td>
                        <td className="px-6 py-4">₹{inv.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              onClick={() => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inv.jsonOutput, null, 4));
                                const downloadAnchorNode = document.createElement('a');
                                downloadAnchorNode.setAttribute("href", dataStr);
                                downloadAnchorNode.setAttribute("download", `${inv.invoiceNo}_einvoice.json`);
                                document.body.appendChild(downloadAnchorNode);
                                downloadAnchorNode.click();
                                downloadAnchorNode.remove();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                              <Download size={14} /> JSON
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* View JSON Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileJson size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 tracking-tight">Invoice Details</h3>
                  <p className="text-xs text-zinc-500 font-medium">{selectedInvoice.invoiceNo}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-zinc-950">
              <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">
                {JSON.stringify(selectedInvoice.jsonOutput, null, 4)}
              </pre>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedInvoice.jsonOutput, null, 4));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", `${selectedInvoice.invoiceNo}_einvoice.json`);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-lg shadow-teal-600/20"
              >
                <Download size={16} /> Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Reusable component to manage Companies and Buyers
function EntityManager({ title, entities, setEntities, companies }: { title: string, entities: any[], setEntities: any, companies?: Company[] }) {
  const [form, setForm] = useState({
    name: "",
    gstin: "",
    stateCode: "",
    pinCode: "",
    address: "",
    location: "",
    companyId: ""
  });

  const [sortBy, setSortBy] = useState<"none" | "company">("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.gstin) return;
    
    setEntities([...entities, { ...form, id: Date.now().toString() }]);
    setForm({ name: "", gstin: "", stateCode: "", pinCode: "", address: "", location: "", companyId: "" });
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter((e: any) => e.id !== id));
  };

  const displayEntities = [...entities].sort((a, b) => {
    if (sortBy === "company" && companies) {
      const compA = companies.find(c => c.id === a.companyId)?.name || "";
      const compB = companies.find(c => c.id === b.companyId)?.name || "";
      return compA.localeCompare(compB);
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-zinc-50 p-6 rounded-xl border border-zinc-200 h-fit">
        <h3 className="font-semibold text-zinc-900 mb-4">Add New {title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {title === "Buyer" && companies && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Company</label>
              <select required className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm bg-white" value={form.companyId} onChange={e => setForm({...form, companyId: e.target.value})}>
                <option value="">-- Select Company --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">{title} Name</label>
            <input required type="text" className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">GST Number</label>
            <input required type="text" className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm uppercase" value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">State Code (e.g. 24)</label>
              <input required type="text" className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm" value={form.stateCode} onChange={e => setForm({...form, stateCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Pin Code</label>
              <input required type="text" className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm" value={form.pinCode} onChange={e => setForm({...form, pinCode: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">City / Location</label>
            <input required type="text" className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Address</label>
            <textarea required rows={2} className="w-full rounded-md border-zinc-300 border px-3 py-2 text-sm" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-md font-medium text-sm hover:bg-primary/90">
            Save {title}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900">Saved {title}s ({entities.length})</h3>
          {title === "Buyer" && (
            <div className="flex items-center gap-2 text-sm">
              <label className="text-zinc-600 font-medium">Sort by:</label>
              <select 
                className="border-zinc-300 border rounded-md px-2 py-1 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="none">Date Added</option>
                <option value="company">Company</option>
              </select>
            </div>
          )}
        </div>
        {entities.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
            No {title.toLowerCase()}s added yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Name & GSTIN</th>
                  <th className="px-4 py-3">Location & Address</th>
                  {title === "Buyer" && <th className="px-4 py-3">Company</th>}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {displayEntities.map((e: any) => (
                  <tr key={e.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">{e.name}</p>
                      <p className="text-xs mt-0.5 text-zinc-500">GST: {e.gstin}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-800">{e.location} - {e.pinCode}</p>
                      <p className="text-xs mt-0.5 text-zinc-500 truncate max-w-[200px]" title={e.address}>{e.address}</p>
                      <p className="text-xs text-zinc-500">State Code: {e.stateCode}</p>
                    </td>
                    {title === "Buyer" && (
                      <td className="px-4 py-3 font-medium text-zinc-700">
                        {companies?.find(c => c.id === e.companyId)?.name || "-"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => removeEntity(e.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
