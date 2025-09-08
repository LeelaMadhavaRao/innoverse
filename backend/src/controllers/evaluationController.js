import { Team, Evaluation } from '../models/index.js';

// Get teams for evaluation
export const getTeamsForEvaluation = async (req, res) => {
  try {
    const teams = await Team.find({ status: 'submitted' });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create evaluation
export const createEvaluation = async (req, res) => {
  try {
    const { teamId, scores, comments, feedback } = req.body;
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const evaluation = await Evaluation.create({
      teamId,
      evaluatorId: req.user._id,
      scores,
      totalScore,
      comments,
      feedback,
      status: 'completed',
      evaluatedAt: new Date()
    });

    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
