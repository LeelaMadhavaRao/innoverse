import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores: {
    innovation: { type: Number, min: 0, max: 10 },
    technical: { type: Number, min: 0, max: 10 },
    presentation: { type: Number, min: 0, max: 10 },
    feasibility: { type: Number, min: 0, max: 10 },
    impact: { type: Number, min: 0, max: 10 }
  },
  totalScore: Number,
  comments: String,
  feedback: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  evaluatedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
