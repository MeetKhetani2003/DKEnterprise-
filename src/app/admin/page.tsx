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
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"careers" | "contacts">("careers");
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Career Applications:{" "}
                <span className="font-semibold text-primary">
                  {careerApplications.length}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                Contact Enquiries:{" "}
                <span className="font-semibold text-primary">
                  {contactEnquiries.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("careers")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "careers"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Career Applications ({careerApplications.length})
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "contacts"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Contact Enquiries ({contactEnquiries.length})
              </button>
            </nav>
          </div>
        </div>

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
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedApplication.email}
                    </p>
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
                {selectedApplication.resume && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Resume
                    </label>
                    <button
                      onClick={() =>
                        downloadFile(
                          selectedApplication.resume!.data,
                          selectedApplication.resume!.name,
                          selectedApplication.resume!.type,
                        )
                      }
                      className="mt-1 inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume ({selectedApplication.resume.name})
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
                    <p className="mt-1 text-sm text-slate-900">
                      {selectedEnquiry.email}
                    </p>
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
                {selectedEnquiry.attachment && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Attachment
                    </label>
                    <button
                      onClick={() =>
                        downloadFile(
                          selectedEnquiry.attachment!.data,
                          selectedEnquiry.attachment!.name,
                          selectedEnquiry.attachment!.type,
                        )
                      }
                      className="mt-1 inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Attachment ({selectedEnquiry.attachment.name})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
