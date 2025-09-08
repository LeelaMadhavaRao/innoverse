import express from 'express';
import { getTeamsForEvaluation, createEvaluation, getEvaluations } from '../controllers/evaluationController.js';
import { protect, evaluator } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get teams for evaluation
// @route   GET /api/evaluations
// @access  Private/Evaluator
router.get('/', protect, evaluator, getTeamsForEvaluation);

// @desc    Get all evaluations
// @route   GET /api/evaluations/all
// @access  Private/Evaluator
router.get('/all', protect, evaluator, getEvaluations);

// @desc    Create evaluation
// @route   POST /api/evaluations
// @access  Private/Evaluator
router.post('/', protect, evaluator, createEvaluation);

export default router;
