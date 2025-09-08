import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  filename: String,
  originalName: String,
  path: String,
  mimeType: String,
  size: Number,
  imageUrl: String,
  url: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploaderEmail: String,
  uploaderRole: String,
  category: { type: String, enum: ['event', 'team', 'general'], default: 'general' },
  tags: [String],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approved: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  isPublic: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  images: [String],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
