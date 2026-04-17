"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, LoaderCircle, UploadCloud } from "lucide-react";
import { z } from "zod";

import { careerSchema } from "@/lib/form-schemas";

type CareerFormValues = z.infer<typeof careerSchema>;

type ApiResponse = {
  success: boolean;
  message: string;
  pdfBase64?: string;
  pdfFileName?: string;
  emailStatus?: string;
};

const fieldLabelClass =
  "mb-2 block text-sm font-medium tracking-tight text-slate-700";
const fieldClass = "input-base h-12 rounded-2xl";
const textareaClass = "input-base min-h-28 rounded-2xl py-3";
const sectionClass = "border-t border-slate-200/70 pt-6";

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-xs text-rose-500">{message}</p>;
}

export function CareersForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CareerFormValues>({
    resolver: zodResolver(careerSchema),
  });

  const resumeField = register("resume");

  const onSubmit = (values: CareerFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("salutation", values.salutation || "");
      formData.append("fullName", values.fullName);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("currentEmployer", values.currentEmployer || "");
      formData.append("currentDesignation", values.currentDesignation);
      formData.append("totalWorkExperience", values.totalWorkExperience);
      formData.append("highestQualification", values.highestQualification);
      formData.append("skills", values.skills);

      const resume = values.resume?.[0];
      if (resume) {
        formData.append("resume", resume);
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as ApiResponse;

      setServerMessage(result.message);
      setEmailStatus(result.emailStatus ?? null);

      if (result.success && result.pdfBase64 && result.pdfFileName) {
        downloadBase64Pdf(result.pdfBase64, result.pdfFileName);
        reset();
        setSelectedFile(null);
      }
    });
  };

  return (
    <div className="card-surface rounded-[1.75rem] p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          Apply for Opportunities
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Submit the form below and our recruitment team will review your
          profile and connect with you soon.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">
            Personal Details
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="grid gap-4 sm:grid-cols-[140px,minmax(0,1fr)]">
                <div>
                  <label className={fieldLabelClass}>Salutation</label>
                  <select {...register("salutation")} className={fieldClass}>
                    <option value="">Mr</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                  </select>
                  <FieldError message={errors.salutation?.message} />
                </div>

                <div>
                  <label className={fieldLabelClass}>Full Name*</label>
                  <input
                    {...register("fullName")}
                    placeholder="Enter full name"
                    className={fieldClass}
                  />
                  <FieldError message={errors.fullName?.message} />
                </div>
              </div>
            </div>

            <div>
              <label className={fieldLabelClass}>Date of Birth*</label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className={fieldClass}
              />
              <FieldError message={errors.dateOfBirth?.message} />
            </div>

            <div>
              <label className={fieldLabelClass}>Email ID*</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter email"
                className={fieldClass}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <label className={fieldLabelClass}>Phone Number*</label>
              <input
                {...register("phone")}
                placeholder="Enter phone number"
                className={fieldClass}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <div className="lg:col-span-2">
              <label className={fieldLabelClass}>Select Gender</label>
              <div className="flex flex-wrap gap-4 pt-1">
                {["Male", "Female", "Other"].map((gender) => (
                  <label
                    key={gender}
                    className="inline-flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="radio"
                      value={gender}
                      {...register("gender")}
                      className="h-4 w-4 border-slate-300 text-primary focus:ring-primary"
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
              <FieldError message={errors.gender?.message} />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">
            Professional Details
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className={fieldLabelClass}>
                Current Employer (if any)
              </label>
              <input
                {...register("currentEmployer")}
                placeholder="Enter employer"
                className={fieldClass}
              />
              <FieldError message={errors.currentEmployer?.message} />
            </div>

            <div>
              <label className={fieldLabelClass}>Current Designation*</label>
              <input
                {...register("currentDesignation")}
                placeholder="Enter current designation"
                className={fieldClass}
              />
              <FieldError message={errors.currentDesignation?.message} />
            </div>

            <div>
              <label className={fieldLabelClass}>Total Work Experience*</label>
              <input
                {...register("totalWorkExperience")}
                placeholder="Select experience"
                className={fieldClass}
              />
              <FieldError message={errors.totalWorkExperience?.message} />
            </div>

            <div>
              <label className={fieldLabelClass}>Highest Qualification*</label>
              <input
                {...register("highestQualification")}
                placeholder="Enter qualification"
                className={fieldClass}
              />
              <FieldError message={errors.highestQualification?.message} />
            </div>

            <div className="lg:col-span-2">
              <label className={fieldLabelClass}>Skills</label>
              <textarea
                {...register("skills")}
                rows={3}
                placeholder="Enter skills"
                className={textareaClass}
              />
              <FieldError message={errors.skills?.message} />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">
            Resume Upload
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className={fieldLabelClass}>Upload Resume</label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 text-sm font-semibold text-primary-dark transition hover:border-primary/40 hover:bg-primary/10">
                  <UploadCloud className="h-4 w-4" />
                  Upload Files
                  <input
                    {...resumeField}
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      resumeField.onChange(e);
                      setSelectedFile(e.target.files?.[0] || null);
                    }}
                  />
                </label>
                <span className="text-sm text-slate-500">
                  {selectedFile
                    ? `${selectedFile.name} (${(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB)`
                    : "No file chosen. PDF, DOC, or DOCX up to 5MB"}
                </span>
              </div>
              <FieldError
                message={errors.resume?.message as string | undefined}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="button-primary min-w-[10rem] border-0"
          >
            {isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Submit Application
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
