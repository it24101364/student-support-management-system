import Complaint, { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from '../complaints/complaint.model.js';
import ServiceRequest, { REQUEST_STATUSES, REQUEST_TYPES } from '../serviceRequests/serviceRequest.model.js';

function fillBuckets(values, rows) {
  const counts = Object.fromEntries(values.map((value) => [value, 0]));
  rows.forEach((row) => { counts[row._id] = row.count; });
  return counts;
}

async function countBy(model, match, field) {
  return model.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } }
  ]);
}

export async function getStudentAnalytics(studentId) {
  const match = { studentId };
  const [complaints, requests, complaintStatuses, requestStatuses] = await Promise.all([
    Complaint.countDocuments(match),
    ServiceRequest.countDocuments(match),
    countBy(Complaint, match, 'status'),
    countBy(ServiceRequest, match, 'status')
  ]);

  return {
    complaints: { total: complaints, byStatus: fillBuckets(COMPLAINT_STATUSES, complaintStatuses) },
    serviceRequests: { total: requests, byStatus: fillBuckets(REQUEST_STATUSES, requestStatuses) }
  };
}

export async function getAdminAnalytics() {
  const [complaints, requests, complaintStatuses, requestStatuses, categories, priorities, types] = await Promise.all([
    Complaint.countDocuments(),
    ServiceRequest.countDocuments(),
    countBy(Complaint, {}, 'status'),
    countBy(ServiceRequest, {}, 'status'),
    countBy(Complaint, {}, 'category'),
    countBy(Complaint, {}, 'priority'),
    countBy(ServiceRequest, {}, 'requestType')
  ]);

  return {
    complaints: {
      total: complaints,
      byStatus: fillBuckets(COMPLAINT_STATUSES, complaintStatuses),
      byCategory: fillBuckets(COMPLAINT_CATEGORIES, categories),
      byPriority: fillBuckets(COMPLAINT_PRIORITIES, priorities)
    },
    serviceRequests: {
      total: requests,
      byStatus: fillBuckets(REQUEST_STATUSES, requestStatuses),
      byType: fillBuckets(REQUEST_TYPES, types)
    }
  };
}
