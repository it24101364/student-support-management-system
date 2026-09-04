import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

export const REQUEST_TYPES = ['ID Card Replacement', 'Transcript Request', 'Certificate Request', 'Hostel Maintenance', 'IT Support Request', 'Library Request', 'Other'];
export const REQUEST_PRIORITIES = ['Low', 'Medium', 'High'];
export const REQUEST_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING', 'COMPLETED', 'REJECTED'];

const serviceRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true, default: () => `REQ-${randomUUID()}` },
    requestType: { type: String, enum: REQUEST_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    priority: { type: String, enum: REQUEST_PRIORITIES, required: true },
    status: { type: String, enum: REQUEST_STATUSES, default: 'SUBMITTED', index: true },
    adminReply: { type: String, trim: true, maxlength: 5000, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

serviceRequestSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model('ServiceRequest', serviceRequestSchema);
