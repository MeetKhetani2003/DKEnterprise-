import { z } from "zod";

const baseSchema = {
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
};

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  companyName: z.string().optional(),
  companySize: z.string().optional(),
  country: z.string().min(1, "Please select a country."),
  state: z.string().optional(),
  city: z.string().optional(),
  inquiryReason: z.string().min(1, "Please select an inquiry reason."),
  service: z.string().min(1, "Please select a service."),
  message: z.string().min(10, "Please describe your enquiry."),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export const careerSchema = z.object({
  salutation: z.string().optional(),
  fullName: z.string().min(2, "Please enter your full name."),
  dateOfBirth: z.string().min(1, "Please enter your date of birth."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select your gender.",
  }),
  currentEmployer: z.string().optional(),
  currentDesignation: z
    .string()
    .min(1, "Please enter your current designation."),
  totalWorkExperience: z
    .string()
    .min(1, "Please enter your total work experience."),
  highestQualification: z
    .string()
    .min(1, "Please enter your highest qualification."),
  skills: z.string().min(1, "Please enter your skills."),
  resume: z
    .any()
    .optional()
    .refine((file) => {
      if (!file || file.length === 0) return true; // Optional
      const f = file[0];
      if (!f) return true;
      if (f.size > 5 * 1024 * 1024) return false; // 5MB limit
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(f.type);
    }, "Please upload a valid PDF, DOC, or DOCX file under 5MB."),
});
