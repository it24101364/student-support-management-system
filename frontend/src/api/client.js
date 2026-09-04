import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/+$/, '')}/api`.replace(/\/api\/api$/, '/api')
  : '/api';

const client = axios.create({
  baseURL: apiBaseUrl
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('support_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
