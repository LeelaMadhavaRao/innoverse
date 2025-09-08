import express from 'express';
import { 
  getUsers, 
  getEmails, 
  getDashboardStats,
  getTeams,
  createTeam,
  getFaculty,
  createFaculty,
  getEvaluators,
  createEvaluator,
  getEvaluations,
  deleteUser,
  updateUser,
  createUser
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all admin routes
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Team management
router.get('/teams', getTeams);
router.post('/teams', createTeam);
router.get('/emails', getEmails);

// Faculty management
router.get('/faculty', getFaculty);
router.post('/faculty', createFaculty);

// Evaluator management
router.get('/evaluators', getEvaluators);
router.post('/evaluators', createEvaluator);

// Evaluation management
router.get('/evaluations', getEvaluations);

export default router;
