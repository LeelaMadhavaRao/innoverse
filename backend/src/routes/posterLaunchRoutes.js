import express from 'express';
import { 
  testPosterLaunch, 
  getPublicLaunchedPosters, 
  getPosterLaunchConfig, 
  getPosterLaunchEvents,
  updatePosterLaunchConfig,
  broadcastMessage,
  launchPoster,
  stopPoster
} from '../controllers/posterLaunchController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/test', testPosterLaunch);
router.get('/public/launched', getPublicLaunchedPosters);
router.get('/events', getPosterLaunchEvents);

// Protected routes
router.get('/config', protect, getPosterLaunchConfig);
router.put('/config', protect, admin, updatePosterLaunchConfig);
router.post('/broadcast', protect, admin, broadcastMessage);
router.post('/launch', protect, admin, launchPoster);
router.delete('/launch/:id', protect, admin, stopPoster);

export default router;
