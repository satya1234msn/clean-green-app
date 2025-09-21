const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/uploads/image
// @desc    Upload a single image
// @access  Private
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'cleangreen/waste-images',
          public_id: `waste_${Date.now()}_${req.user._id}`,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while uploading image'
    });
  }
});

// @route   POST /api/uploads/multiple
// @desc    Upload multiple images
// @access  Private
router.post('/multiple', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No image files provided'
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Maximum 5 images allowed'
      });
    }

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'cleangreen/waste-images',
            public_id: `waste_${Date.now()}_${req.user._id}_${index}`,
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      status: 'success',
      message: 'Images uploaded successfully',
      data: {
        images: results.map(result => ({
          imageUrl: result.secure_url,
          publicId: result.public_id
        }))
      }
    });
  } catch (error) {
    console.error('Multiple image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while uploading images'
    });
  }
});

// @route   POST /api/uploads/delivery-documents
// @desc    Upload delivery agent documents
// @access  Private
router.post('/delivery-documents', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No document file provided'
      });
    }

    const { documentType } = req.body;

    if (!documentType || !['license', 'insurance', 'registration', 'other'].includes(documentType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid document type is required'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'cleangreen/delivery-documents',
          public_id: `${documentType}_${Date.now()}_${req.user._id}`,
          transformation: [
            { width: 1000, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(200).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        documentType
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while uploading document'
    });
  }
});

// @route   DELETE /api/uploads/:publicId
// @desc    Delete an uploaded image
// @access  Private
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        status: 'success',
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting image'
    });
  }
});

module.exports = router;
