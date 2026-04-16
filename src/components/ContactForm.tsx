'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckCircle2, LoaderCircle, UploadCloud } from 'lucide-react';
import { z } from 'zod';

import { contactSchema } from '@/lib/form-schemas';

type ContactFormValues = z.infer<typeof contactSchema> & {
  attachment?: FileList;
};

type ApiResponse = {
  success: boolean;
  message: string;
  pdfBase64?: string;
  pdfFileName?: string;
  emailStatus?: string;
};

function downloadBase64Pdf(base64: string, fileName: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
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
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('subject', values.subject);
      formData.append('message', values.message);
      const attachment = values.attachment?.[0];
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await fetch('/api/contact', { method: 'POST', body: formData });
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
        <span className="section-kicker">Send Us a Message</span>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Tell us what your facility needs.</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Share your requirement and we&apos;ll generate a downloadable PDF summary after submission.
        </p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register('name')} placeholder="Full Name" className="input-base" />
          {errors.name ? <p className="mt-2 text-xs text-rose-500">{errors.name.message}</p> : null}
        </div>
        <div>
          <input {...register('email')} type="email" placeholder="Email Address" className="input-base" />
          {errors.email ? <p className="mt-2 text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>
        <div>
          <input {...register('phone')} placeholder="Phone Number" className="input-base" />
          {errors.phone ? <p className="mt-2 text-xs text-rose-500">{errors.phone.message}</p> : null}
        </div>
        <div>
          <input {...register('subject')} placeholder="Subject" className="input-base" />
          {errors.subject ? <p className="mt-2 text-xs text-rose-500">{errors.subject.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <textarea {...register('message')} placeholder="Message" rows={6} className="input-base resize-none" />
          {errors.message ? <p className="mt-2 text-xs text-rose-500">{errors.message.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-primary hover:bg-primary/5">
            <UploadCloud className="h-6 w-6 text-primary" />
            <span className="mt-3 text-sm font-medium text-slate-800">Attach a document</span>
            <span className="mt-1 text-xs text-slate-500">Optional supporting file up to 5MB</span>
            <input {...register('attachment')} type="file" className="sr-only" />
          </label>
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={isPending} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Enquiry
          </button>
        </div>
      </form>

      {serverMessage ? (
        <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">{serverMessage}</p>
              {emailStatus ? <p className="mt-1 text-emerald-700">{emailStatus}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
