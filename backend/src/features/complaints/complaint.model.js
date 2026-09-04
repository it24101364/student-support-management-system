import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

export const COMPLAINT_CATEGORIES = ['Academic', 'Hostel', 'IT Support', 'Library', 'Finance', 'Facilities', 'Other'];
export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High'];
export const COMPLAINT_STATUSES = ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED'];

const complaintSchema = new mongoose.Schema(
  {
    complaintNumber: { type: String, required: true, unique: true, default: () => `CMP-${randomUUID()}` },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, enum: COMPLAINT_CATEGORIES, required: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    priority: { type: String, enum: COMPLAINT_PRIORITIES, required: true },
    status: { type: String, enum: COMPLAINT_STATUSES, default: 'PENDING', index: true },
    adminReply: { type: String, trim: true, maxlength: 5000, default: '' }
  },
  { timestamps: true }
);

complaintSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model('Complaint', complaintSchema);
