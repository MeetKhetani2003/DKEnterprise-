import { z } from 'zod';

const baseSchema = {
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(8, 'Please enter a valid phone number.'),
};

export const contactSchema = z.object({
  ...baseSchema,
  subject: z.string().min(3, 'Please enter a subject.'),
  message: z.string().min(10, 'Please share a few details about your requirement.'),
});

export const careerSchema = z.object({
  ...baseSchema,
  department: z.string().min(1, 'Please choose a department.'),
  location: z.string().min(1, 'Please choose a location.'),
  experience: z.string().min(1, 'Please share your experience.'),
});
