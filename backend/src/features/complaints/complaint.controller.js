import * as complaintService from './complaint.service.js';

export async function listMine(request, response, next) {
  try { response.json({ success: true, data: await complaintService.listMyComplaints(request.user._id) }); } catch (error) { next(error); }
}

export async function getMine(request, response, next) {
  try { response.json({ success: true, data: await complaintService.getMyComplaint(request.user._id, request.params.id) }); } catch (error) { next(error); }
}

export async function create(request, response, next) {
  try { response.status(201).json({ success: true, data: await complaintService.createComplaint(request.user._id, request.body) }); } catch (error) { next(error); }
}

export async function update(request, response, next) {
  try { response.json({ success: true, data: await complaintService.updateMyComplaint(request.user._id, request.params.id, request.body) }); } catch (error) { next(error); }
}

export async function remove(request, response, next) {
  try { await complaintService.deleteMyComplaint(request.user._id, request.params.id); response.status(204).send(); } catch (error) { next(error); }
}
