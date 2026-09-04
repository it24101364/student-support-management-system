import client from '../../api/client.js';

export async function registerAccount(payload) {
  const { data } = await client.post('/auth/register', payload);
  return data.data;
}

export async function loginAccount(payload) {
  const { data } = await client.post('/auth/login', payload);
  return data.data;
}

export async function getCurrentUser() {
  const { data } = await client.get('/auth/me');
  return data.data.user;
}

export async function requestPasswordReset(email) {
  const { data } = await client.post('/auth/forgot-password', { email });
  return data.data;
}

export async function verifyPasswordOtp(email, otp) {
  const { data } = await client.post('/auth/verify-otp', { email, otp });
  return data.data.resetToken;
}

export async function updatePassword(email, resetToken, password) {
  const { data } = await client.post('/auth/reset-password', { email, resetToken, password });
  return data.data;
}
