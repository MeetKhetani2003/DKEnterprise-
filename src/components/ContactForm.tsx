"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { z } from "zod";

import { contactSchema } from "@/lib/form-schemas";
import {
  countries,
  companySizes,
  indianStates,
  services,
  inquiryReasons,
} from "@/lib/forms-data";

type ContactFormValues = z.infer<typeof contactSchema>;

type ApiResponse = {
  success: boolean;
  message: string;
  pdfBase64?: string;
  pdfFileName?: string;
  emailStatus?: string;
};

function downloadBase64Pdf(base64: string, fileName: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ContactForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("companyName", values.companyName || "");
      formData.append("companySize", values.companySize || "");
      formData.append("country", values.country);
      formData.append("state", values.state || "");
      formData.append("city", values.city || "");
      formData.append("inquiryReason", values.inquiryReason);
      formData.append("service", values.service);
      formData.append("message", values.message);
      formData.append("agreeToTerms", values.agreeToTerms.toString());
      formData.append("subject", values.service);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as ApiResponse;

      setServerMessage(result.message);
      setEmailStatus(result.emailStatus ?? null);

      if (result.success && result.pdfBase64 && result.pdfFileName) {
        downloadBase64Pdf(result.pdfBase64, result.pdfFileName);
        reset();
      }
    });
  };

  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          Contact Us
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Submit the form below and our representative will connect with you
          soon.
        </p>
      </div>

      <form
        className="grid gap-5 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Your Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Name
          </label>
          <input
            {...register("name")}
            placeholder="Enter your Name"
            className="input-base"
          />
          {errors.name ? (
            <p className="mt-2 text-xs text-rose-500">{errors.name.message}</p>
          ) : null}
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Work Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Email ID"
            className="input-base"
          />
          {errors.email ? (
            <p className="mt-2 text-xs text-rose-500">{errors.email.message}</p>
          ) : null}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            {...register("phone")}
            placeholder="Phone Number"
            className="input-base"
          />
          {errors.phone ? (
            <p className="mt-2 text-xs text-rose-500">{errors.phone.message}</p>
          ) : null}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Name
          </label>
          <input
            {...register("companyName")}
            placeholder="Company Name"
            className="input-base"
          />
          {errors.companyName ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.companyName.message}
            </p>
          ) : null}
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Size
          </label>
          <select {...register("companySize")} className="input-base">
            <option value="">Small Enterprise</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {errors.companySize ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.companySize.message}
            </p>
          ) : null}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Country
          </label>
          <select {...register("country")} className="input-base">
            <option value="">India</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.country.message}
            </p>
          ) : null}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            State
          </label>
          <select {...register("state")} className="input-base">
            <option value="">Enter state</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state ? (
            <p className="mt-2 text-xs text-rose-500">{errors.state.message}</p>
          ) : null}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City
          </label>
          <input
            {...register("city")}
            placeholder="Enter city"
            className="input-base"
          />
          {errors.city ? (
            <p className="mt-2 text-xs text-rose-500">{errors.city.message}</p>
          ) : null}
        </div>

        {/* Inquiry Reason - Radio Buttons */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Please tell us what you&apos;re enquiring about?
          </label>
          <div className="space-y-2">
            {inquiryReasons.map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  {...register("inquiryReason")}
                  value={reason}
                  className="h-4 w-4 text-primary"
                />
                <span className="ml-2 text-sm text-slate-700">{reason}</span>
              </label>
            ))}
          </div>
          {errors.inquiryReason ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.inquiryReason.message}
            </p>
          ) : null}
        </div>

        {/* Service Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Please select the service of your interest:
          </label>
          <select {...register("service")} className="input-base">
            <option value="">Aviation</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.service.message}
            </p>
          ) : null}
        </div>

        {/* Message/Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Describe your enquiry or service of interest:
          </label>
          <textarea
            {...register("message")}
            placeholder="Give details"
            rows={6}
            className="input-base resize-none"
          />
          {errors.message ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.message.message}
            </p>
          ) : null}
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="md:col-span-2">
          <label className="flex items-start">
            <input
              type="checkbox"
              {...register("agreeToTerms")}
              className="h-4 w-4 text-primary rounded mt-1"
            />
            <span className="ml-3 text-sm text-slate-700">
              I have read and agree to Terms and Conditions and to process my
              data by their Privacy Policy.
            </span>
          </label>
          {errors.agreeToTerms ? (
            <p className="mt-2 text-xs text-rose-500">
              {errors.agreeToTerms.message}
            </p>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 w-full"
          >
            {isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Submit
          </button>
        </div>
      </form>

      {serverMessage ? (
        <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">{serverMessage}</p>
              {emailStatus ? (
                <p className="mt-1 text-emerald-700">{emailStatus}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
