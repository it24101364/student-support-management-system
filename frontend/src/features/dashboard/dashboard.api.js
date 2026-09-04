import client from '../../api/client.js';

export async function getStudentAnalytics() {
  const { data } = await client.get('/analytics/student');
  return data.data;
}

export async function getAdminAnalytics() {
  const { data } = await client.get('/analytics/admin');
  return data.data;
}
