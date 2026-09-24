import mongoose, { Document, Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
}

const CompanySchema = new mongoose.Schema<ICompany>({
  name: { type: String, required: true, unique: true },
});

export default (mongoose.models.Company as Model<ICompany>) || mongoose.model<ICompany>("Company", CompanySchema);
