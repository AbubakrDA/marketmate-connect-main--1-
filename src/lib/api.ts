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
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/login/access-token', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/users/me');
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
};

export default api;
