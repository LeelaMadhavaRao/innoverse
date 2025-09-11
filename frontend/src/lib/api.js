import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://inno-backend-y1bv.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create public axios instance (no auth required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: log token attachment (trimmed)
      try { console.debug('[api] Attaching token to', config.url, 'token=', token?.slice?.(0,8) + '...'); } catch(e) { }
    } else {
      try { console.debug('[api] No token present for', config.url); } catch(e) {}
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Emit session expired event so UI can handle redirect and toasts
      try { window.dispatchEvent(new CustomEvent('sessionExpired', { detail: { message: 'Session expired' } })); } catch (e) {}
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/auth/register', userData),
};

// Team API calls
export const teamAPI = {
  getProfile: () => api.get('/team/profile'),
  updateProfile: (data) => api.put('/team/profile', data),
  getGallery: () => api.get('/team/gallery'),
  uploadToGallery: (formData) => api.post('/gallery/team/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResults: () => api.get('/team/results'),
  getAllTeams: () => api.get('/teams'),
};

// Gallery API calls
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data),
  approve: (id) => api.put(`/gallery/${id}/approve`),
  delete: (id) => api.delete(`/gallery/${id}`),
  upload: (formData) => api.post('/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadWithCloudimage: async (file, metadata = {}) => {
    // First upload to Cloudimage if configured
    const cloudimageService = await import('../services/cloudimage');
    
    if (cloudimageService.default.isAvailable()) {
      try {
        const cloudResult = await cloudimageService.default.uploadImage(file, {
          folder: 'gallery',
          tags: metadata.tags
        });
        
        // Then save the Cloudimage URL to backend
        return api.post('/gallery', {
          title: metadata.title,
          description: metadata.description,
          url: cloudResult.public_id || cloudResult.url,
          cloudimageUrl: cloudResult.url,
          originalFilename: file.name,
          mimeType: file.type,
          size: file.size,
          ...metadata
        });
      } catch (error) {
        console.warn('Cloudimage upload failed, falling back to regular upload:', error);
      }
    }
    
    // Fallback to regular upload
    const formData = new FormData();
    formData.append('photos', file);
    formData.append('title', metadata.title || '');
    formData.append('description', metadata.description || '');
    
    return api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
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
  updateTeam: (teamId, data) => api.put(`/admin/teams/${teamId}`, data),
  deleteTeam: (teamId) => api.delete(`/admin/teams/${teamId}`),
  
  // Faculty
  getFaculty: () => api.get('/admin/faculty'),
  createFaculty: (facultyData) => api.post('/admin/faculty', facultyData),
  resendFacultyInvitation: (facultyId) => api.post(`/admin/faculty/${facultyId}/resend-invitation`),
  updateFaculty: (facultyId, data) => api.put(`/admin/faculty/${facultyId}`, data),
  deleteFaculty: (facultyId) => api.delete(`/admin/faculty/${facultyId}`),
  
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
  
  // Video Launch
  getPromotionVideos: () => api.get('/admin/video-launch/videos'),
  launchVideo: (launchData) => api.post('/admin/video-launch/launch', launchData),
  getLaunchedVideos: () => api.get('/admin/video-launch/launched'),
  stopVideoLaunch: (videoId) => api.delete(`/admin/video-launch/launched/${videoId}`),
  updateVideoLaunch: (videoId, updateData) => api.put(`/admin/video-launch/launched/${videoId}`, updateData),
  resetAllVideoLaunches: () => api.delete('/admin/video-launch/reset-all'),
  
  // Combined Reset
  resetAllLaunches: () => api.delete('/admin/reset-all-launches'),
};

// Faculty API calls
export const facultyAPI = {
  getDashboard: () => api.get('/faculty/dashboard'),
  getTeams: () => api.get('/faculty/teams'),
  getAllTeams: () => api.get('/teams'),
  getEvaluations: () => api.get('/faculty/evaluations'),
  getEvaluationResults: () => api.get('/faculty/evaluation-results'),
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
  
  // Video public endpoints
  getPublicLaunchedVideos: () => publicApi.get('/poster-launch/public/videos/launched'),
  incrementVideoView: (videoId) => publicApi.put(`/poster-launch/public/videos/launched/${videoId}/view`),
  addVideoWatchTime: (videoId, watchTime) => publicApi.put(`/poster-launch/public/videos/launched/${videoId}/watch-time`, { watchTime }),
  
  // Combined content endpoint
  getAllPublicLaunchedContent: () => publicApi.get('/poster-launch/public/launched/all'),
};

export default api;
