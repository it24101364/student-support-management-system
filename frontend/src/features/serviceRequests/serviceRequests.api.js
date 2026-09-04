import client from '../../api/client.js';

export async function createServiceRequest(payload) { const { data } = await client.post('/service-requests', payload); return data.data; }
export async function getMyServiceRequests() { const { data } = await client.get('/service-requests/my'); return data.data; }
export async function getServiceRequest(id) { const { data } = await client.get(`/service-requests/${id}`); return data.data; }
export async function deleteServiceRequest(id) { await client.delete(`/service-requests/${id}`); }
