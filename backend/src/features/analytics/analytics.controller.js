import { getAdminAnalytics, getStudentAnalytics } from './analytics.service.js';

export async function studentAnalytics(request, response, next) {
  try {
    response.json({ success: true, data: await getStudentAnalytics(request.user._id) });
  } catch (error) {
    next(error);
  }
}

export async function adminAnalytics(_request, response, next) {
  try {
    response.json({ success: true, data: await getAdminAnalytics() });
  } catch (error) {
    next(error);
  }
}
