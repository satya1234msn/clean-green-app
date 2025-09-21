const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const Reward = require('../models/Reward');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('addresses')
      .populate('defaultAddress');

    res.status(200).json({
      status: 'success',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('vehicleType').optional().isIn(['bike', 'scooter', 'car', 'van']),
  body('licenseNumber').optional().trim()
], protect, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'phone', 'vehicleType', 'licenseNumber'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
});

// @route   PUT /api/users/online-status
// @desc    Update online status (for delivery agents)
// @access  Private
router.put('/online-status', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const { isOnline } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isOnline },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: `Status updated to ${isOnline ? 'online' : 'offline'}`,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update online status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating status'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole === 'user') {
      // Get user dashboard data
      const recentUploads = await Pickup.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(2)
        .populate('address');

      const acceptedUpload = recentUploads.find(pickup => pickup.status === 'completed');
      const rejectedUpload = recentUploads.find(pickup => pickup.status === 'rejected');

      const rewards = await Reward.find({ 
        user: userId, 
        isRedeemed: false,
        expiryDate: { $gt: new Date() }
      }).sort({ issuedDate: -1 });

      const totalPickups = await Pickup.countDocuments({ user: userId });
      const completedPickups = await Pickup.countDocuments({ 
        user: userId, 
        status: 'completed' 
      });

      const totalPoints = await Pickup.aggregate([
        { $match: { user: userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$points' } } }
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          recentUploads: {
            accepted: acceptedUpload,
            rejected: rejectedUpload
          },
          rewards: rewards.slice(0, 2), // Show only 2 recent rewards
          stats: {
            totalPickups,
            completedPickups,
            totalPoints: totalPoints[0]?.total || 0
          }
        }
      });
    } else {
      // Get delivery agent dashboard data
      const completedPickups = await Pickup.countDocuments({ 
        deliveryAgent: userId, 
        status: 'completed' 
      });

      const totalEarnings = await Pickup.aggregate([
        { $match: { deliveryAgent: userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$earnings' } } }
      ]);

      const availablePickups = await Pickup.find({
        status: 'pending',
        priority: 'now'
      }).populate('user', 'name phone').populate('address');

      res.status(200).json({
        status: 'success',
        data: {
          stats: {
            completedPickups,
            totalEarnings: totalEarnings[0]?.total || 0,
            rating: req.user.rating
          },
          availablePickups: availablePickups.slice(0, 5) // Show only 5 available pickups
        }
      });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/users/history
// @desc    Get user pickup history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const userId = req.user._id;

    const pickups = await Pickup.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('address')
      .populate('deliveryAgent', 'name phone vehicleType')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pickup.countDocuments({ user: userId });

    res.status(200).json({
      status: 'success',
      data: {
        pickups,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching history'
    });
  }
});

// @route   GET /api/users/earnings
// @desc    Get delivery agent earnings
// @access  Private
router.get('/earnings', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const userId = req.user._id;

    const earnings = await Pickup.aggregate([
      { $match: { deliveryAgent: userId, status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalEarnings: { $sum: '$earnings' },
          pickups: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);

    const totalEarnings = await Pickup.aggregate([
      { $match: { deliveryAgent: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$earnings' } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        earnings,
        totalEarnings: totalEarnings[0]?.total || 0,
        availableBalance: req.user.earnings.available
      }
    });
  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching earnings'
    });
  }
});

module.exports = router;
