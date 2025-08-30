import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface
export interface IShift extends Document {
  userId: string;
  companyStaffId: string;
  role: string;
  department: string;
  contactNumberExt: string;
  contactNumber: string;
  shift: 'morning' | 'noon' | 'night';
  status: 'present' | 'absent' | 'leave';
  startTime: string;
  endTime: string;
  date: Date;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const ShiftSchema: Schema<IShift> = new Schema(
  {
    userId: { type: String, required: true },
    shift: { type: String, enum: ['Morning', 'Noon', 'Night'], required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    date: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    // createdBy: { type: String, required: true },
    // updatedBy: { type: String, required: true },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Export Model
const Shift = mongoose.model<IShift>('Shift', ShiftSchema);
export default Shift;