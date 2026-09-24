import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["superadmin", "admin"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
