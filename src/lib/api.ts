import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('marketmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await api.post('/login/access-token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
};

export const userService = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/users/');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export const businessService = {
  getAll: async () => {
    const response = await api.get('/businesses/');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/businesses/${id}`);
    return response.data;
  },
  getByOwner: async (ownerId: string) => {
    const response = await api.get(`/businesses/owner/${ownerId}`);
    return response.data;
  },
};

export const listingService = {
  getAll: async () => {
    const response = await api.get('/listings/');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },
  getByBusiness: async (businessId: string) => {
    const response = await api.get(`/listings/business/${businessId}`);
    return response.data;
  },
};

export const leadService = {
  submit: async (leadData: any) => {
    const response = await api.post('/leads/', leadData);
    return response.data;
  },
  getByBusiness: async (businessId: string) => {
    const response = await api.get(`/leads/business/${businessId}`);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/leads/');
    return response.data;
  },
};

export const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin/stats');
    return response.data;
  },
  getBusinessStats: async (businessId: string) => {
    const response = await api.get(`/dashboard/business/${businessId}/stats`);
    return response.data;
  },
};

export default api;
