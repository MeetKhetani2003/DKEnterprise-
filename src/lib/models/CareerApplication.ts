import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    salutation: { type: String, required: false },
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    currentEmployer: { type: String, required: false },
    currentDesignation: { type: String, required: true },
    totalWorkExperience: { type: String, required: true },
    highestQualification: { type: String, required: true },
    skills: { type: String, required: true },
    resumeFileId: { type: String, required: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CareerApplication =
  mongoose.models.CareerApplication ||
  mongoose.model("CareerApplication", careerApplicationSchema);

export default CareerApplication;
