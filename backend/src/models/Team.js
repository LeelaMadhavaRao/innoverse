import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamLeader: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rollNumber: String,
    year: String,
    branch: String
  },
  teamMembers: [{
    name: { type: String, required: true },
    email: String,
    phone: String,
    rollNumber: String,
    year: String,
    branch: String,
    role: { type: String, enum: ['member', 'leader'], default: 'member' },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  projectDetails: {
    techStack: [String],
    description: String
  },
  credentials: {
    username: { type: String, required: true },
    password: { type: String, required: true },
    isPasswordChanged: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['active', 'inactive', 'registered', 'submitted', 'evaluated'], default: 'active' },
  invitationSent: { type: Boolean, default: false },
  invitationSentAt: Date,
  evaluationStatus: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  evaluationScores: [Number],
  college: String,
  projectTitle: String,
  projectDescription: String,
  techStack: [String],
  submissionDate: Date,
  evaluationScore: Number,
  evaluatorComments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
