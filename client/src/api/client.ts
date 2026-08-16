import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinelx_token');
  const orgId = localStorage.getItem('sentinelx_org_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (orgId) {
    config.headers['X-Organization-Id'] = orgId;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sentinelx_token');
    }
    return Promise.reject(error.response?.data?.error || { message: error.message });
  }
);
