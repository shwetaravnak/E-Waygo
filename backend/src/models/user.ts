import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'user' | 'ewaste_center' | 'admin';
  facility?: string; // for ewaste_center
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ['user', 'ewaste_center', 'admin'], default: 'user' },
    facility: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
