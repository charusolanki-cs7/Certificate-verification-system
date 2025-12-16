import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/admin/login', credentials),
  register: (data) => api.post('/auth/admin/register', data),
  getMe: () => api.get('/auth/admin/me'),
  updatePassword: (data) => api.put('/auth/admin/updatepassword', data)
};

// Admin API
export const adminAPI = {
  uploadStudents: (formData) => {
    return api.post('/admin/upload-students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getStudents: (params) => api.get('/admin/students', { params }),
  generateCertificate: (studentId) => api.post(`/admin/generate-certificate/${studentId}`),
  getStats: () => api.get('/admin/stats')
};

// Certificate API
export const certificateAPI = {
  search: (certificateId) => api.get(`/certificate/search/${certificateId}`),
  download: (certificateId) => {
    return api.get(`/certificate/download/${certificateId}`, {
      responseType: 'blob'
    });
  },
  verify: (data) => api.post('/certificate/verify', data),
  getAll: (params) => api.get('/certificate/all', { params })
};

export default api;
