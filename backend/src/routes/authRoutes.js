import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', logoutUser);

export default router;
