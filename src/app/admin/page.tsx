"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Eye,
  Mail,
  Phone,
  User,
  Calendar,
  Building,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquare,
  LogOut,
  Users,
  Send,
  FileSpreadsheet,
} from "lucide-react";
import { SendEmailForm } from "@/components/SendEmailForm";
import { Login } from "@/components/admin/Login";
import { TendersTab } from "@/components/admin/TendersTab";
import { AdminsTab } from "@/components/admin/AdminsTab";

type CareerApplication = {
  _id: string;
  salutation?: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  gender: string;
  currentEmployer?: string;
  currentDesignation: string;
  totalWorkExperience: string;
  highestQualification: string;
  skills: string;
  resumeFileId?: string;
  submittedAt: string;
};

type ContactEnquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachmentFileId?: string;
  submittedAt: string;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activeTab, setActiveTab] = useState<"careers" | "contacts" | "send-email" | "tenders" | "admins">("careers");
  const [careerApplications, setCareerApplications] = useState<
    CareerApplication[]
  >([]);
  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<CareerApplication | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(
    null,
  );
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState("");
  const [replySubject, setReplySubject] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [careersRes, contactsRes] = await Promise.all([
        fetch("/api/admin/careers"),
        fetch("/api/admin/contacts"),
      ]);

      if (careersRes.ok) {
        const careersData = await careersRes.json();
        setCareerApplications(careersData);
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContactEnquiries(contactsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileId: string, bucketName: string) => {
    try {
      const response = await fetch(
        `/api/download?fileId=${fileId}&bucket=${bucketName}`,
      );
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Get filename from response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "download";
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches) {
          filename = matches[1];
        }
      }

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={(role) => {
          setIsAuthenticated(true);
          setUserRole(role);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl z-20 relative">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</div>
          
          <button
            onClick={() => setActiveTab("careers")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === "careers"
                ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg shadow-primary/25"
                : "hover:bg-white/5 hover:text-white text-slate-400"
            }`}
          >
            <Briefcase size={18} className={activeTab === "careers" ? "text-white" : "text-slate-400"} />
            Career Applications
            <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "careers" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
              {careerApplications.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("contacts")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === "contacts"
                ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg shadow-primary/25"
                : "hover:bg-white/5 hover:text-white text-slate-400"
            }`}
          >
            <MessageSquare size={18} className={activeTab === "contacts" ? "text-white" : "text-slate-400"} />
            Contact Enquiries
            <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "contacts" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
              {contactEnquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tenders")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === "tenders"
                ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg shadow-primary/25"
                : "hover:bg-white/5 hover:text-white text-slate-400"
            }`}
          >
            <FileSpreadsheet size={18} className={activeTab === "tenders" ? "text-white" : "text-slate-400"} />
            Tenders
          </button>

          <button
            onClick={() => setActiveTab("send-email")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === "send-email"
                ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg shadow-primary/25"
                : "hover:bg-white/5 hover:text-white text-slate-400"
            }`}
          >
            <Send size={18} className={activeTab === "send-email" ? "text-white" : "text-slate-400"} />
            Send Email
          </button>

          {userRole === "superadmin" && (
            <>
              <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4">Administration</div>
              <button
                onClick={() => setActiveTab("admins")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === "admins"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "hover:bg-white/5 hover:text-white text-slate-400"
                }`}
              >
                <Users size={18} className={activeTab === "admins" ? "text-white" : "text-slate-400"} />
                Manage Admins
              </button>
            </>
          )}
        </nav>
        <div className="p-6 border-t border-white/5">
           <button 
             onClick={() => window.location.reload()} 
             className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 bg-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300"
           >
             <LogOut size={16} />
             Log Out
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight flex items-center gap-2">
                {activeTab.replace("-", " ")}
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Manage and view your {activeTab.replace("-", " ")}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-6 bg-slate-50/80 px-5 py-2.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Briefcase size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Careers</span>
                    <span className="text-sm font-bold text-slate-700">{careerApplications.length}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enquiries</span>
                    <span className="text-sm font-bold text-slate-700">{contactEnquiries.length}</span>
                  </div>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
                <span className="font-bold text-sm">{userRole === 'superadmin' ? 'SA' : 'AD'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">

        {activeTab === "admins" && (
          <AdminsTab />
        )}

        {activeTab === "tenders" && (
          <TendersTab role={userRole} />
        )}

        {activeTab === "careers" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Career Applications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {careerApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {app.salutation ? `${app.salutation} ` : ""}
                              {app.fullName}
                            </div>
                            <div className="text-sm text-slate-500">
                              {app.highestQualification}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {app.email}
                        </div>
                        <div className="text-sm text-slate-500">
                          {app.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {app.currentDesignation}
                        </div>
                        <div className="text-sm text-slate-500">
                          {app.totalWorkExperience} experience
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="text-primary hover:text-primary/80"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setReplyToEmail(app.email);
                              setReplySubject(`Reply to Career Application - ${app.fullName}`);
                              setShowReplyModal(true);
                            }}
                            className="text-teal-600 hover:text-teal-800"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          {app.resumeFileId && (
                            <button
                              onClick={() =>
                                downloadFile(app.resumeFileId!, "resumes")
                              }
                              className="text-slate-600 hover:text-slate-800"
                              title="Download Resume"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Contact Enquiries
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {contactEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {enquiry.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {enquiry.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {enquiry.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs truncate">
                          {enquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(enquiry.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="text-primary hover:text-primary/80"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setReplyToEmail(enquiry.email);
                              setReplySubject(`Reply to Contact Enquiry - ${enquiry.subject}`);
                              setShowReplyModal(true);
                            }}
                            className="text-teal-600 hover:text-teal-800"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          {enquiry.attachmentFileId && (
                            <button
                              onClick={() =>
                                downloadFile(
                                  enquiry.attachmentFileId!,
                                  "attachments",
                                )
                              }
                              className="text-slate-600 hover:text-slate-800"
                              title="Download Attachment"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "send-email" && (
          <div className="max-w-4xl mx-auto">
            <SendEmailForm />
          </div>
        )}

        {/* Career Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Career Application Details
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.salutation
                        ? `${selectedApplication.salutation} `
                        : ""}
                      {selectedApplication.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Date of Birth
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {new Date(
                        selectedApplication.dateOfBirth,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-sm text-slate-900">
                        {selectedApplication.email}
                      </p>
                      <button
                        onClick={() => {
                          setReplyToEmail(selectedApplication.email);
                          setReplySubject(`Reply to Career Application - ${selectedApplication.fullName}`);
                          setShowReplyModal(true);
                        }}
                        className="text-teal-600 hover:text-teal-800"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Gender
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.gender}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Current Employer
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.currentEmployer || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Current Designation
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.currentDesignation}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Total Work Experience
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.totalWorkExperience}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Highest Qualification
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.highestQualification}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Submitted At
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {formatDate(selectedApplication.submittedAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Skills
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {selectedApplication.skills}
                  </p>
                </div>
                {selectedApplication.resumeFileId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Resume
                    </label>
                    <button
                      onClick={() =>
                        downloadFile(selectedApplication.resumeFileId!, "resumes")
                      }
                      className="mt-1 inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Enquiry Details Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Contact Enquiry Details
                </h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedEnquiry.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-sm text-slate-900">
                        {selectedEnquiry.email}
                      </p>
                      <button
                        onClick={() => {
                          setReplyToEmail(selectedEnquiry.email);
                          setReplySubject(`Reply to Contact Enquiry - ${selectedEnquiry.subject}`);
                          setShowReplyModal(true);
                        }}
                        className="text-teal-600 hover:text-teal-800"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedEnquiry.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Subject
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedEnquiry.subject}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Submitted At
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {formatDate(selectedEnquiry.submittedAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <p className="mt-1 text-sm text-slate-900 whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
                {selectedEnquiry.attachmentFileId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Attachment
                    </label>
                    <button
                      onClick={() =>
                        downloadFile(
                          selectedEnquiry.attachmentFileId!,
                          "attachments",
                        )
                      }
                      className="mt-1 inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Attachment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Email Reply Modal */}
        {showReplyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60] backdrop-blur-sm transition-all duration-350">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Compose Reply
                </h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-800 transition hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <SendEmailForm
                  prefilledTo={replyToEmail}
                  prefilledSubject={replySubject}
                  onSuccess={() => {
                    setTimeout(() => setShowReplyModal(false), 2000);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
