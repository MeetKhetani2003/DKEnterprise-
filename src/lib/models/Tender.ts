import mongoose from "mongoose";

const TenderSchema = new mongoose.Schema({
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
  bidValue: { type: String, required: true },
  gstJsonFileTypeSoftware: { type: String, required: true },
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

export default mongoose.models.Tender || mongoose.model("Tender", TenderSchema);
