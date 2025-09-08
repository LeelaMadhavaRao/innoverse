import express from 'express';
import { getTeamProfile, updateTeamProfile, getTeamGallery, getTeamResults } from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get team profile
// @route   GET /api/team/profile
// @access  Private
router.get('/profile', protect, getTeamProfile);

// @desc    Update team profile
// @route   PUT /api/team/profile
// @access  Private
router.put('/profile', protect, updateTeamProfile);

// @desc    Get team gallery
// @route   GET /api/team/gallery
// @access  Private
router.get('/gallery', protect, getTeamGallery);

// @desc    Get team results
// @route   GET /api/team/results
// @access  Private
router.get('/results', protect, getTeamResults);

export default router;
