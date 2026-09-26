import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: false },
    companySize: { type: String, required: false },
    country: { type: String, required: true },
    state: { type: String, required: false },
    city: { type: String, required: false },
    inquiryReason: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
    attachmentFileId: { type: String, required: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ContactEnquiry =
  mongoose.models.ContactEnquiry ||
  mongoose.model("ContactEnquiry", contactEnquirySchema);

export default ContactEnquiry;
