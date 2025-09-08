import Gallery from '../models/Gallery.js';
import path from 'path';
import fs from 'fs';

// Get all gallery items
export const getGalleryItems = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    } else {
      // By default, only show approved items for public access
      query.status = 'approved';
    }

    const images = await Gallery.find(query)
      .populate('uploadedBy', 'name email role')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    console.error('Get gallery items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get gallery statistics
export const getGalleryStats = async (req, res) => {
  try {
    const totalItems = await Gallery.countDocuments();
    const approvedItems = await Gallery.countDocuments({ status: 'approved' });
    const pendingItems = await Gallery.countDocuments({ status: 'pending' });
    const rejectedItems = await Gallery.countDocuments({ status: 'rejected' });

    res.json({
      total: totalItems,
      approved: approvedItems,
      pending: pendingItems,
      rejected: rejectedItems
    });
  } catch (error) {
    console.error('Get gallery stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new gallery item
export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    
    // Handle file upload
    let imageUrl = '';
    let filename = '';
    let originalName = '';
    let filePath = '';
    let mimeType = '';
    let size = 0;

    if (req.file) {
      filename = `gallery-${Date.now()}-${Math.round(Math.random() * 1E9)}.${req.file.originalname.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'gallery');
      
      // Create upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      filePath = path.join(uploadDir, filename);
      imageUrl = `/uploads/gallery/${filename}`;
      originalName = req.file.originalname;
      mimeType = req.file.mimetype;
      size = req.file.size;
      
      // Save file
      fs.writeFileSync(filePath, req.file.buffer);
    } else {
      // Fallback for testing
      imageUrl = `https://placeholder.com/400x300?text=${encodeURIComponent(title)}`;
    }
    
    const galleryItem = await Gallery.create({
      title,
      description,
      filename,
      originalName,
      path: filePath,
      mimeType,
      size,
      imageUrl,
      url: `${process.env.BASE_URL}${imageUrl}`,
      uploadedBy: req.user._id,
      uploaderEmail: req.user.email,
      uploaderRole: req.user.role,
      category: category || 'general',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    const populatedItem = await Gallery.findById(galleryItem._id)
      .populate('uploadedBy', 'name email role');

    // Return success response in format expected by frontend
    res.status(201).json({
      success: true,
      message: 'Gallery item uploaded successfully',
      data: populatedItem
    });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during upload',
      error: error.message 
    });
  }
};

// Approve gallery item
export const approveGalleryItem = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    gallery.status = 'approved';
    gallery.approved = true;
    gallery.isApproved = true;
    gallery.approvedBy = req.user._id;
    gallery.approvedAt = new Date();
    gallery.updatedAt = new Date();
    
    await gallery.save();

    const updatedGallery = await Gallery.findById(gallery._id)
      .populate('uploadedBy', 'name email role')
      .populate('approvedBy', 'name email');

    res.json(updatedGallery);
  } catch (error) {
    console.error('Approve gallery item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete file if it exists
    if (gallery.path && fs.existsSync(gallery.path)) {
      fs.unlinkSync(gallery.path);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
