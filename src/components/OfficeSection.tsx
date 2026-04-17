"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Printer } from "lucide-react";
import { offices } from "@/lib/forms-data";
import { SectionHeading } from "@/components/SectionHeading";

export function OfficeSection() {
  const [activeTab, setActiveTab] = useState<
    "offices" | "branches" | "facilities"
  >("offices");

  const officesByType = {
    offices: offices.filter((office) => office.type === "offices"),
    branches: offices.filter((office) => office.type === "branches"),
    facilities: offices.filter((office) => office.type === "facilities"),
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker="Our Offices"
        title="Reach out to our team"
        description="Contact our offices or branches directly for immediate assistance."
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => setActiveTab("offices")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "offices"
              ? "border-primary text-primary"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Offices
        </button>
        <button
          onClick={() => setActiveTab("branches")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "branches"
              ? "border-primary text-primary"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Branch Offices
        </button>
        <button
          onClick={() => setActiveTab("facilities")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "facilities"
              ? "border-primary text-primary"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Facilities
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {officesByType[activeTab].map((office) => (
          <div
            key={office.title}
            className="card-surface p-6 rounded-lg border border-slate-200"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {office.title}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                <span>{office.address}</span>
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                <span>{office.phone}</span>
              </p>
              {office.fax && (
                <p className="flex gap-3">
                  <Printer className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{office.fax}</span>
                </p>
              )}
              {office.email && (
                <p className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{office.email}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
