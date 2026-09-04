import Complaint, { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from './complaint.model.js';
import mongoose from 'mongoose';
import { createHttpError } from '../../shared/errors.js';
import { requireText } from '../../shared/validation.js';

function validateChoice(value, field, choices) {
  if (!choices.includes(value)) throw createHttpError(400, `${field} must be one of: ${choices.join(', ')}`);
  return value;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) throw createHttpError(400, 'Complaint id is invalid');
}

function validateInput(input) {
  return {
    title: requireText(input.title, 'Title', { max: 160 }),
    category: validateChoice(input.category, 'Category', COMPLAINT_CATEGORIES),
    description: requireText(input.description, 'Description', { max: 5000 }),
    priority: validateChoice(input.priority, 'Priority', COMPLAINT_PRIORITIES)
  };
}

export function listMyComplaints(studentId) {
  return Complaint.find({ studentId }).sort({ createdAt: -1 }).lean();
}

export async function getMyComplaint(studentId, complaintId) {
  validateId(complaintId);
  if (!Complaint.exists({ _id: complaintId })) throw createHttpError(404, 'Complaint not found');
  const complaint = await Complaint.findOne({ _id: complaintId, studentId }).lean();
  if (!complaint) throw createHttpError(403, 'You cannot access this complaint');
  return complaint;
}

export function createComplaint(studentId, input) {
  return Complaint.create({ ...validateInput(input), studentId });
}

export async function updateMyComplaint(studentId, complaintId, input) {
  validateId(complaintId);
  const complaint = await Complaint.findOne({ _id: complaintId, studentId });
  if (!complaint) throw createHttpError(403, 'You cannot modify this complaint');
  if (complaint.status !== 'PENDING') throw createHttpError(409, 'Only pending complaints can be edited');
  Object.assign(complaint, validateInput(input));
  return complaint.save();
}

export async function deleteMyComplaint(studentId, complaintId) {
  validateId(complaintId);
  const complaint = await Complaint.findOne({ _id: complaintId, studentId });
  if (!complaint) throw createHttpError(403, 'You cannot delete this complaint');
  if (complaint.status !== 'PENDING') throw createHttpError(409, 'Only pending complaints can be deleted');
  await complaint.deleteOne();
}
