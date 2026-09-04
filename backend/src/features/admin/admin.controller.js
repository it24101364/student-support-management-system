import * as service from './admin.service.js';

export async function listUsers(request, response, next) {
  try { response.json({ success: true, data: await service.listUsers(request.query) }); } catch (error) { next(error); }
}

export async function updateUserStatus(request, response, next) {
  try { response.json({ success: true, data: await service.setUserStatus(request.user._id, request.params.id, request.body.status) }); } catch (error) { next(error); }
}

export async function updateComplaintStatus(request, response, next) {
  try { response.json({ success: true, data: await service.setComplaintStatus(request.params.id, request.body.status) }); } catch (error) { next(error); }
}

export async function listComplaints(_request, response, next) { try { response.json({ success: true, data: await service.listComplaints() }); } catch (error) { next(error); } }
export async function updateComplaint(request, response, next) { try { response.json({ success: true, data: await service.updateComplaint(request.params.id, request.body.status, request.body.reply) }); } catch (error) { next(error); } }

export async function updateRequestStatus(request, response, next) {
  try { response.json({ success: true, data: await service.setRequestStatus(request.params.id, request.body.status) }); } catch (error) { next(error); }
}

export async function listRequests(_request, response, next) { try { response.json({ success: true, data: await service.listRequests() }); } catch (error) { next(error); } }
export async function updateRequest(request, response, next) { try { response.json({ success: true, data: await service.updateRequest(request.params.id, request.body.status, request.body.reply) }); } catch (error) { next(error); } }
