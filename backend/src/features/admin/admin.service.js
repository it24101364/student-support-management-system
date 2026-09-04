import mongoose from 'mongoose';
import User from '../../models/User.js';
import Complaint, { COMPLAINT_STATUSES } from '../complaints/complaint.model.js';
import ServiceRequest, { REQUEST_STATUSES } from '../serviceRequests/serviceRequest.model.js';
import { createHttpError } from '../../shared/errors.js';

const USER_STATUSES = ['ACTIVE', 'INACTIVE'];

function validateStatus(status, values, label) {
  if (!values.includes(status)) throw createHttpError(400, `${label} must be one of: ${values.join(', ')}`);
}

function validateId(id, label) {
  if (!mongoose.isValidObjectId(id)) throw createHttpError(400, `${label} id is invalid`);
}

function validateReply(reply) {
  if (reply !== undefined && (typeof reply !== 'string' || reply.trim().length > 5000)) throw createHttpError(400, 'Reply must be at most 5000 characters');
  return reply?.trim() ?? '';
}

export async function listUsers({ search = '', role, status, page = 1, limit = 20 }) {
  const filters = {};
  if (role) { validateStatus(role, ['STUDENT', 'ADMIN'], 'Role'); filters.role = role; }
  if (status) { validateStatus(status, USER_STATUSES, 'Status'); filters.status = status; }
  if (search.trim()) filters.$or = [{ name: { $regex: search.trim(), $options: 'i' } }, { email: { $regex: search.trim(), $options: 'i' } }];
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const [users, total] = await Promise.all([
    User.find(filters).select('name email role status createdAt').sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    User.countDocuments(filters)
  ]);
  return { users, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } };
}

export async function setUserStatus(adminId, userId, status) {
  validateId(userId, 'User'); validateStatus(status, USER_STATUSES, 'Status');
  if (adminId.toString() === userId) throw createHttpError(400, 'You cannot change your own account status');
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('name email role status createdAt').lean();
  if (!user) throw createHttpError(404, 'User not found');
  return user;
}

export async function setComplaintStatus(complaintId, status) {
  validateId(complaintId, 'Complaint'); validateStatus(status, COMPLAINT_STATUSES, 'Complaint status');
  const complaint = await Complaint.findByIdAndUpdate(complaintId, { status }, { new: true }).lean();
  if (!complaint) throw createHttpError(404, 'Complaint not found');
  return complaint;
}

export function listComplaints() {
  return Complaint.find().populate('studentId', 'name email').sort({ createdAt: -1 }).lean();
}

export async function updateComplaint(complaintId, status, reply) {
  validateId(complaintId, 'Complaint'); validateStatus(status, COMPLAINT_STATUSES, 'Complaint status');
  const complaint = await Complaint.findByIdAndUpdate(complaintId, { status, adminReply: validateReply(reply) }, { new: true, runValidators: true }).populate('studentId', 'name email').lean();
  if (!complaint) throw createHttpError(404, 'Complaint not found');
  return complaint;
}

export async function setRequestStatus(requestId, status) {
  validateId(requestId, 'Service request'); validateStatus(status, REQUEST_STATUSES, 'Service request status');
  const request = await ServiceRequest.findByIdAndUpdate(requestId, { status }, { new: true }).lean();
  if (!request) throw createHttpError(404, 'Service request not found');
  return request;
}

export function listRequests() {
  return ServiceRequest.find().populate('studentId', 'name email').sort({ createdAt: -1 }).lean();
}

export async function updateRequest(requestId, status, reply) {
  validateId(requestId, 'Service request'); validateStatus(status, REQUEST_STATUSES, 'Service request status');
  const request = await ServiceRequest.findByIdAndUpdate(requestId, { status, adminReply: validateReply(reply) }, { new: true, runValidators: true }).populate('studentId', 'name email').lean();
  if (!request) throw createHttpError(404, 'Service request not found');
  return request;
}
