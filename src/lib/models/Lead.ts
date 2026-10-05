import mongoose, { Document, Model } from "mongoose";

export interface ILead extends Document {
  accountName: string;
  vertical: string;
  location: string;
  facilityType: string;
  decisionMaker: string;
  contact: string;
  currentVendor: string;
  contractExpiry: string;
  estimatedManpower: string;
  estimatedAnnualValue: string;
  stage: string;
  nextAction: string;
  nextActionDate: string;
  probability: string;
  competitors: string;
  paymentTerms: string;
  risks: string;
  owner: string;
  isDeleted: boolean;
  deleteReason?: string;
  deletedBy?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LeadSchema = new mongoose.Schema<ILead>({
  accountName: { type: String, required: true },
  vertical: { type: String, required: true },
  location: { type: String, required: true },
  facilityType: { type: String, required: true },
  decisionMaker: { type: String, required: true },
  contact: { type: String, required: true },
  currentVendor: { type: String, required: true },
  contractExpiry: { type: String, required: true },
  estimatedManpower: { type: String, required: true },
  estimatedAnnualValue: { type: String, required: true },
  stage: { type: String, required: true },
  nextAction: { type: String, required: true },
  nextActionDate: { type: String, required: true },
  probability: { type: String, required: true },
  competitors: { type: String, required: true },
  paymentTerms: { type: String, required: true },
  risks: { type: String, required: true },
  owner: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  deleteReason: { type: String },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default (mongoose.models.Lead as Model<ILead>) || mongoose.model<ILead>("Lead", LeadSchema);
