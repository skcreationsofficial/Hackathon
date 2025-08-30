import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  mobileNumber: number;
  email: string;
  password: string;
  role: "user" | "doctor" | "admin";
  profile?: {
    age: number;
    specialization: string;
    dob: Date;  // Store dob inside profile
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    required: true,
    default: "user",
  },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: Number, required: true, unique: true },  // Store as Number
  profile: {
    age: { type: Number, required: false },
    specialization: { type: String, required: false },
    dob: { type: Date, required: true },  // Store dob inside profile
  },
});

const User = model<IUser>("User", userSchema);

export { User, IUser };