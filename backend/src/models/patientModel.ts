// models/Patient.ts
import mongoose, { model, Schema, Document } from 'mongoose';
 
export interface IPatient extends Document {
    name: string;
    email: string;
    phone: string;
    address?: string;
    dateOfBirth?: string;
    gender: 'Male' | 'Female' | 'Other';
    status: string;
    isActive: boolean
    createdBy: mongoose.Types.ObjectId; // receptionist ID
    createdAt: Date;
    updatedAt: Date;
}
 
const PatientSchema = new Schema<IPatient>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: String,
    dateOfBirth: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    status: String,
    isActive: {type: Boolean, default: true},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', defaut:Date.now},
}, { timestamps: true });
 
export const Patient = model<IPatient>('Patient', PatientSchema);