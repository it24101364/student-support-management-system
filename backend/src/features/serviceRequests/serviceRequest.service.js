import mongoose from 'mongoose';
import ServiceRequest, { REQUEST_PRIORITIES, REQUEST_TYPES } from './serviceRequest.model.js';
import { createHttpError } from '../../shared/errors.js';
import { requireText } from '../../shared/validation.js';

function choice(value, field, values) {
  if (!values.includes(value)) throw createHttpError(400, `${field} must be one of: ${values.join(', ')}`);
  return value;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) throw createHttpError(400, 'Request id is invalid');
}

function validateInput(input) {
  return {
    requestType: choice(input.requestType, 'Request type', REQUEST_TYPES),
    title: requireText(input.title, 'Title', { max: 160 }),
    description: requireText(input.description, 'Description', { max: 5000 }),
    priority: choice(input.priority, 'Priority', REQUEST_PRIORITIES)
  };
}

export function listMyRequests(studentId) {
  return ServiceRequest.find({ studentId }).sort({ createdAt: -1 }).lean();
}

export async function getMyRequest(studentId, requestId) {
  validateId(requestId);
  const request = await ServiceRequest.findOne({ _id: requestId, studentId }).lean();
  if (!request) throw createHttpError(404, 'Service request not found');
  return request;
}

export function createRequest(studentId, input) {
  return ServiceRequest.create({ ...validateInput(input), studentId });
}

export async function updateMyRequest(studentId, requestId, input) {
  validateId(requestId);
  const request = await ServiceRequest.findOne({ _id: requestId, studentId });
  if (!request) throw createHttpError(404, 'Service request not found');
  if (request.status !== 'SUBMITTED') throw createHttpError(409, 'Only submitted requests can be edited');
  Object.assign(request, validateInput(input));
  return request.save();
}

export async function deleteMyRequest(studentId, requestId) {
  validateId(requestId);
  const request = await ServiceRequest.findOne({ _id: requestId, studentId });
  if (!request) throw createHttpError(404, 'Service request not found');
  if (request.status !== 'SUBMITTED') throw createHttpError(409, 'Only submitted requests can be deleted');
  await request.deleteOne();
}
