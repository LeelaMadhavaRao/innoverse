import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://innoverse-orpin.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Create public axios instance (no auth required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request to:', config.baseURL + config.url);
    console.log('🔧 Request config:', {
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API response error:', error);
    console.error('📄 Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('🔄 Direct login attempt with fetch...');
      
      const response = await fetch('https://innoverse-orpin.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
        mode: 'cors', // Explicitly set CORS mode
      });
      
      console.log('📡 Fetch response status:', response.status);
      console.log('📡 Fetch response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Fetch response data:', data);
      
      return { data };
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  },
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/auth/register', userData),
};

// Team API calls
export const teamAPI = {
  getProfile: () => api.get('/team/profile'),
  updateProfile: (data) => api.put('/team/profile', data),
  getGallery: () => api.get('/team/gallery'),
  getResults: () => api.get('/team/results'),
  uploadToGallery: (formData) => api.post('/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Gallery API calls
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data),
  approve: (id) => api.post(`/gallery/${id}/approve`),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Evaluation API calls
export const evaluationAPI = {
  getAll: () => api.get('/evaluations'),
  create: (data) => api.post('/evaluations', data),
  update: (id, data) => api.put(`/evaluations/${id}`, data),
  getTeams: () => api.get('/evaluations/teams'),
};

// Admin API calls
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Teams
  getTeams: () => api.get('/admin/teams'),
  createTeam: (teamData) => api.post('/admin/teams', teamData),
  resendTeamInvitation: (teamId) => api.post(`/admin/teams/${teamId}/resend-invitation`),
  
  // Faculty
  getFaculty: () => api.get('/admin/faculty'),
  createFaculty: (facultyData) => api.post('/admin/faculty', facultyData),
  resendFacultyInvitation: (facultyId) => api.post(`/admin/faculty/${facultyId}/resend-invitation`),
  
  // Evaluators
  getEvaluators: () => api.get('/admin/evaluators'),
  createEvaluator: (evaluatorData) => api.post('/admin/evaluators', evaluatorData),
  assignTeamsToEvaluator: (evaluatorId, teamIds) => api.post(`/admin/evaluators/${evaluatorId}/assign-teams`, { teamIds }),
  
  // Evaluations
  getEvaluations: () => api.get('/admin/evaluations'),
  getTeamEvaluations: (teamId) => api.get(`/admin/evaluations/team/${teamId}`),
  
  // Emails
  getEmails: () => api.get('/admin/emails'),
  
  // Poster Launch
  getPosters: () => api.get('/admin/poster-launch/posters'),
  launchPoster: (launchData) => api.post('/admin/poster-launch/launch', launchData),
  getLaunchedPosters: () => api.get('/admin/poster-launch/launched'),
  stopPosterLaunch: (posterId) => api.delete(`/admin/poster-launch/launched/${posterId}`),
  updatePosterLaunch: (posterId, updateData) => api.put(`/admin/poster-launch/launched/${posterId}`, updateData),
  resetAllPosterLaunches: () => api.delete('/admin/poster-launch/reset-all'),
};

// Faculty API calls
export const facultyAPI = {
  getDashboard: () => api.get('/faculty/dashboard'),
  getTeams: () => api.get('/faculty/teams'),
  getEvaluations: () => api.get('/faculty/evaluations'),
  getReports: () => api.get('/faculty/reports'),
};

// Poster Launch API calls
export const posterLaunchAPI = {
  getConfig: () => api.get('/poster-launch/config'),
  updateConfig: (data) => api.put('/poster-launch/config', data),
  broadcast: (message) => api.post('/poster-launch/broadcast', { message }),
  getEvents: () => api.get('/poster-launch/events'),
  
  // Public endpoints (no auth required)
  getPublicLaunchedPosters: () => publicApi.get('/poster-launch/public/launched'),
  incrementPosterView: (posterId) => publicApi.put(`/poster-launch/public/launched/${posterId}/view`),
};

export default api;
