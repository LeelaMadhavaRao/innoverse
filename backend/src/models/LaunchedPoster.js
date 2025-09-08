import mongoose from 'mongoose';

const launchedPosterSchema = new mongoose.Schema({
  posterId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  imageUrl: String,
  theme: String,
  date: String,
  organizer: String,
  status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
  config: {
    scheduledTime: Date,
    duration: Number,
    targetAudience: { type: String, enum: ['all', 'teams', 'faculty', 'evaluators'], default: 'all' },
    message: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  launchedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  analytics: {
    views: { type: Number, default: 0 },
    interactions: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  isVisible: { type: Boolean, default: true },
  launchedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LaunchedPoster = mongoose.model('LaunchedPoster', launchedPosterSchema);

export default LaunchedPoster;
