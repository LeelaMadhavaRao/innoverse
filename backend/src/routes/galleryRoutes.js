import express from 'express';
import multer from 'multer';
import { getGalleryItems, createGalleryItem, approveGalleryItem, deleteGalleryItem, getGalleryStats } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
router.get('/', getGalleryItems);

// @desc    Get gallery stats
// @route   GET /api/gallery/stats
// @access  Private/Admin
router.get('/stats', protect, admin, getGalleryStats);

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private
router.post('/', protect, upload.single('image'), createGalleryItem);

// @desc    Approve gallery item
// @route   PUT /api/gallery/:id/approve
// @access  Private/Admin
router.put('/:id/approve', protect, admin, approveGalleryItem);

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteGalleryItem);

export default router;
