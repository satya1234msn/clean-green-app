import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
};

export const pickupApi = {
  list: ({ status = 'pending', page = 1, limit = 10, from, to, wasteType, priority, search } = {}) =>
    api.get('/pickups/admin/pending', { params: { status, page, limit, from, to, wasteType, priority, search } }),
  approve: (id) => api.put(`/pickups/${id}/admin/approve`),
  reject: (id, reason) => api.put(`/pickups/${id}/admin/reject`, { reason }),
};

export default api;


