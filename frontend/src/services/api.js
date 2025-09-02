import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// School API functions
export const schoolAPI = {
  // Add a new school
  addSchool: async (formData) => {
    try {
      const response = await api.post('/schools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all schools
  getAllSchools: async (params = {}) => {
    try {
      const response = await api.get('/schools', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get school by ID
  getSchoolById: async (id) => {
    try {
      const response = await api.get(`/schools/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update school
  updateSchool: async (id, formData) => {
    try {
      const response = await api.put(`/schools/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete school
  deleteSchool: async (id) => {
    try {
      const response = await api.delete(`/schools/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default api;
