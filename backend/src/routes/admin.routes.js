import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
import {
  getDashboardStats,
  
  // Team Management
  getTeams,
  createTeam,
  resendTeamInvitation,
  
  // Faculty Management
  getFaculty,
  createFaculty,
  resendFacultyInvitation,
  
  // Evaluator Management
  getEvaluators,
  createEvaluator,
  assignTeamsToEvaluator,
  
  // Evaluation Management
  getEvaluations,
  getTeamEvaluations,
  
  // User Management
  getUsers,
  deleteUser,
  updateUser,
  
  // Poster Launch Management
  getPosters,
  launchPoster,
  getLaunchedPosters,
  stopPosterLaunch,
  updatePosterLaunch,
  resetAllPosterLaunches,
  
  // Video Launch Management
  getPromotionVideos,
  launchPromotionVideo,
  getLaunchedVideos,
  stopVideoLaunch,
  updateVideoLaunch,
  resetAllVideoLaunches,
  resetAllLaunches
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protection and admin check to all routes
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Team Management Routes
router.route('/teams')
  .get(getTeams)
  .post(createTeam);

router.post('/teams/:id/resend-invitation', resendTeamInvitation);

// Faculty Management Routes
router.route('/faculty')
  .get(getFaculty)
  .post(createFaculty);

router.post('/faculty/:id/resend-invitation', resendFacultyInvitation);

// Evaluator Management Routes
router.route('/evaluators')
  .get(getEvaluators)
  .post(createEvaluator);

router.post('/evaluators/:id/assign-teams', assignTeamsToEvaluator);

// Evaluation Management Routes
router.get('/evaluations', getEvaluations);
router.get('/evaluations/team/:teamId', getTeamEvaluations);

// User Management Routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .delete(deleteUser)
  .put(updateUser);

// Poster Launch Management Routes
router.route('/poster-launch/posters')
  .get(getPosters);

router.route('/poster-launch/launch')
  .post(launchPoster);

router.route('/poster-launch/launched')
  .get(getLaunchedPosters);

router.route('/poster-launch/reset-all')
  .delete(resetAllPosterLaunches);

router.route('/poster-launch/launched/:id')
  .delete(stopPosterLaunch)
  .put(updatePosterLaunch);

// Video Launch Management Routes
router.route('/video-launch/videos')
  .get(getPromotionVideos);

router.route('/video-launch/launch')
  .post(launchPromotionVideo);

router.route('/video-launch/launched')
  .get(getLaunchedVideos);

router.route('/video-launch/reset-all')
  .delete(resetAllVideoLaunches);

router.route('/video-launch/launched/:id')
  .delete(stopVideoLaunch)
  .put(updateVideoLaunch);

// Combined Reset Route
router.route('/reset-all-launches')
  .delete(resetAllLaunches);

export default router;
