import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import teamRoutes from './routes/team.routes.js';
import posterLaunchRoutes from './routes/posterLaunch.routes.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/poster-launch', posterLaunchRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
