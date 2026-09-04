import client from '../../api/client.js';

export async function createComplaint(payload) {
  const { data } = await client.post('/complaints', payload);
  return data.data;
}

export async function getMyComplaints() {
  const { data } = await client.get('/complaints/my');
  return data.data;
}

export async function getComplaint(id) {
  const { data } = await client.get(`/complaints/${id}`);
  return data.data;
}

export async function deleteComplaint(id) {
  await client.delete(`/complaints/${id}`);
}
