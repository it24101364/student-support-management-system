import client from '../../api/client.js';

export async function getUsers(filters = {}) {
  const { data } = await client.get('/admin/users', { params: filters });
  return data.data;
}

export async function updateUserStatus(id, status) {
  const { data } = await client.patch(`/admin/users/${id}/status`, { status });
  return data.data;
}
