import mongoose, { Document, Model } from "mongoose";

export interface ITender extends Document {
  companies: string[];
  tenderNo: string;
  departmentOrg: string;
  tenderLastDate: string;
  filed: string;
  bidClosingTime: string;
  location: string;
  officeDocuments: string;
  msePurchasePreference: string;
  category: string;
  contractPeriodYear: string;
  manpower: string;
  emdExemption: string;
  turnoverExperienceExemption: string;
  emdValue?: string;
  bidValue: string;
  technicalStatus: string;
  award: string;
  isDeleted: boolean;
  deleteReason?: string;
  deletedBy?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TenderSchema = new mongoose.Schema<ITender>({
  companies: [{ type: String }],
  tenderNo: { type: String, required: true },
  departmentOrg: { type: String, required: true },
  tenderLastDate: { type: String, required: true },
  filed: { type: String, enum: ["YES", "NO"], required: true },
  bidClosingTime: { type: String, required: true },
  location: { type: String, required: true },
  officeDocuments: { type: String, required: true },
  msePurchasePreference: { type: String, enum: ["YES", "NO"], required: true },
  category: { type: String, required: true },
  contractPeriodYear: { type: String, required: true },
  manpower: { type: String, required: true },
  emdExemption: { type: String, enum: ["YES", "NO"], required: true },
  turnoverExperienceExemption: { type: String, enum: ["YES", "NO"], required: true },
  emdValue: { type: String },
  bidValue: { type: String, required: true },
  technicalStatus: { type: String, enum: ['No Status', 'Disqualify', 'Qualify', 'Canceled Bid'], default: 'No Status' },
  award: { type: String, enum: ['YES', 'NO'], default: 'NO' },
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

export default (mongoose.models.Tender as Model<ITender>) || mongoose.model<ITender>("Tender", TenderSchema);
