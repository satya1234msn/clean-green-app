const express = require('express');
const { body, validationResult } = require('express-validator');
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const Reward = require('../models/Reward');
const { protect, restrictTo, requireOnline } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/pickups
// @desc    Create a new pickup request
// @access  Private
router.post('/', [
  body('address').isMongoId().withMessage('Valid address ID is required'),
  body('wasteType').isIn(['food', 'bottles', 'other', 'mixed']).withMessage('Valid waste type is required'),
  body('wasteDetails').isObject().withMessage('Waste details are required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('priority').isIn(['now', 'scheduled']).withMessage('Priority must be now or scheduled'),
  body('scheduledDate').optional().isISO8601(),
  body('scheduledTime').optional().isString()
], protect, restrictTo('user'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      address,
      wasteType,
      wasteDetails,
      images,
      priority,
      scheduledDate,
      scheduledTime
    } = req.body;

    // Validate waste details based on waste type
    if (wasteType === 'food' && (!wasteDetails.foodBoxes || wasteDetails.foodBoxes <= 0)) {
      return res.status(400).json({
        status: 'error',
        message: 'Number of food boxes is required for food waste'
      });
    }

    if (wasteType === 'bottles' && (!wasteDetails.bottles || wasteDetails.bottles <= 0)) {
      return res.status(400).json({
        status: 'error',
        message: 'Number of bottles is required for bottle waste'
      });
    }

    if (wasteType === 'other' && (!wasteDetails.otherItems || wasteDetails.otherItems.trim() === '')) {
      return res.status(400).json({
        status: 'error',
        message: 'Description of other items is required for other waste'
      });
    }

    // Create pickup request
    const pickupData = {
      user: req.user._id,
      address,
      wasteType,
      wasteDetails,
      images,
      priority
    };

    if (priority === 'scheduled') {
      if (!scheduledDate || !scheduledTime) {
        return res.status(400).json({
          status: 'error',
          message: 'Scheduled date and time are required for scheduled pickups'
        });
      }
      pickupData.scheduledDate = new Date(scheduledDate);
      pickupData.scheduledTime = scheduledTime;
    }

    const pickup = new Pickup(pickupData);
    
    // Calculate points and earnings
    pickup.calculatePoints();
    
    await pickup.save();

    // Populate the pickup with user and address details
    await pickup.populate([
      { path: 'user', select: 'name phone' },
      { path: 'address' }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Pickup request created successfully',
      data: {
        pickup
      }
    });
  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating pickup request'
    });
  }
});

// @route   GET /api/pickups/available
// @desc    Get available pickup requests for delivery agents
// @access  Private
router.get('/available', protect, restrictTo('delivery'), requireOnline, async (req, res) => {
  try {
    const availablePickups = await Pickup.find({
      status: 'pending',
      priority: 'now'
    })
    .populate('user', 'name phone')
    .populate('address')
    .sort({ createdAt: -1 })
    .limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        pickups: availablePickups
      }
    });
  } catch (error) {
    console.error('Get available pickups error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching available pickups'
    });
  }
});

// @route   PUT /api/pickups/:id/accept
// @desc    Accept a pickup request
// @access  Private
router.put('/:id/accept', protect, restrictTo('delivery'), requireOnline, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        status: 'error',
        message: 'Pickup request not found'
      });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Pickup request is no longer available'
      });
    }

    // Update pickup status
    pickup.deliveryAgent = req.user._id;
    pickup.status = 'accepted';
    pickup.timeline.push({
      status: 'accepted',
      notes: 'Pickup request accepted by delivery agent'
    });

    // Calculate earnings based on distance (simplified calculation)
    const distance = Math.random() * 10 + 1; // Random distance between 1-11 km
    pickup.distance = distance;
    pickup.calculateEarnings();

    await pickup.save();

    // Populate pickup details
    await pickup.populate([
      { path: 'user', select: 'name phone' },
      { path: 'address' },
      { path: 'deliveryAgent', select: 'name phone vehicleType rating' }
    ]);

    // Emit real-time notification to user
    req.io.to(`user-${pickup.user._id}`).emit('pickup-accepted', {
      pickup: pickup,
      deliveryAgent: pickup.deliveryAgent
    });

    res.status(200).json({
      status: 'success',
      message: 'Pickup request accepted successfully',
      data: {
        pickup
      }
    });
  } catch (error) {
    console.error('Accept pickup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while accepting pickup request'
    });
  }
});

// @route   PUT /api/pickups/:id/reject
// @desc    Reject a pickup request
// @access  Private
router.put('/:id/reject', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        status: 'error',
        message: 'Pickup request not found'
      });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Pickup request is no longer available'
      });
    }

    pickup.status = 'rejected';
    pickup.timeline.push({
      status: 'rejected',
      notes: 'Pickup request rejected by delivery agent'
    });

    await pickup.save();

    res.status(200).json({
      status: 'success',
      message: 'Pickup request rejected'
    });
  } catch (error) {
    console.error('Reject pickup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while rejecting pickup request'
    });
  }
});

// @route   PUT /api/pickups/:id/status
// @desc    Update pickup status
// @access  Private
router.put('/:id/status', [
  body('status').isIn(['in_progress', 'completed', 'cancelled']).withMessage('Valid status is required'),
  body('location').optional().isObject(),
  body('notes').optional().isString()
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

    const { status, location, notes } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        status: 'error',
        message: 'Pickup request not found'
      });
    }

    // Check permissions
    const isDeliveryAgent = req.user.role === 'delivery' && pickup.deliveryAgent.toString() === req.user._id.toString();
    const isUser = req.user.role === 'user' && pickup.user.toString() === req.user._id.toString();

    if (!isDeliveryAgent && !isUser) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this pickup'
      });
    }

    pickup.status = status;
    pickup.timeline.push({
      status,
      location,
      notes
    });

    // If completed, update user points and create reward
    if (status === 'completed') {
      // Update user points
      await User.findByIdAndUpdate(pickup.user, {
        $inc: { 
          totalPoints: pickup.points,
          totalPickups: 1
        }
      });

      // Update delivery agent earnings
      await User.findByIdAndUpdate(pickup.deliveryAgent, {
        $inc: { 
          'earnings.total': pickup.earnings,
          'earnings.available': pickup.earnings,
          completedPickups: 1
        }
      });

      // Create reward for user
      const reward = new Reward({
        user: pickup.user,
        pickup: pickup._id,
        type: 'pickup_completion',
        title: 'Waste Pickup Completed',
        description: `You earned ${pickup.points} points for your ${pickup.wasteType} waste pickup`,
        couponCode: `CLEAN${Date.now()}`,
        partner: 'CleanGreen',
        discount: '10% off',
        minOrder: '₹100',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        pointsEarned: pickup.points
      });

      await reward.save();
    }

    await pickup.save();

    // Emit real-time notification
    if (status === 'completed') {
      req.io.to(`user-${pickup.user}`).emit('pickup-completed', {
        pickup,
        points: pickup.points
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Pickup status updated successfully',
      data: {
        pickup
      }
    });
  } catch (error) {
    console.error('Update pickup status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating pickup status'
    });
  }
});

// @route   POST /api/pickups/:id/rate
// @desc    Rate a completed pickup
// @access  Private
router.post('/:id/rate', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isString().isLength({ max: 500 })
], protect, restrictTo('user'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, review } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        status: 'error',
        message: 'Pickup request not found'
      });
    }

    if (pickup.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only rate your own pickups'
      });
    }

    if (pickup.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'You can only rate completed pickups'
      });
    }

    if (pickup.rating.score) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already rated this pickup'
      });
    }

    pickup.rating = {
      score: rating,
      review,
      ratedAt: new Date()
    };

    await pickup.save();

    // Update delivery agent's average rating
    if (pickup.deliveryAgent) {
      const deliveryAgent = await User.findById(pickup.deliveryAgent);
      const newCount = deliveryAgent.rating.count + 1;
      const newAverage = ((deliveryAgent.rating.average * deliveryAgent.rating.count) + rating) / newCount;

      deliveryAgent.rating = {
        average: Math.round(newAverage * 10) / 10,
        count: newCount
      };

      await deliveryAgent.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Rating submitted successfully',
      data: {
        pickup
      }
    });
  } catch (error) {
    console.error('Rate pickup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting rating'
    });
  }
});

// @route   GET /api/pickups/user
// @desc    Get user's pickup requests
// @access  Private
router.get('/user', protect, restrictTo('user'), async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const userId = req.user._id;

    let query = { user: userId };
    
    if (status === 'live') {
      query.status = { $in: ['pending', 'accepted'] };
    } else if (status === 'history') {
      query.status = { $in: ['completed', 'rejected', 'cancelled'] };
    } else if (status !== 'all') {
      query.status = status;
    }

    const pickups = await Pickup.find(query)
      .populate('address')
      .populate('deliveryAgent', 'name phone vehicleType rating')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: 'success',
      data: {
        pickups
      }
    });
  } catch (error) {
    console.error('Get user pickups error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user pickups'
    });
  }
});

// @route   GET /api/pickups/:id
// @desc    Get pickup details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate('user', 'name phone')
      .populate('deliveryAgent', 'name phone vehicleType rating')
      .populate('address');

    if (!pickup) {
      return res.status(404).json({
        status: 'error',
        message: 'Pickup request not found'
      });
    }

    // Check permissions
    const isOwner = pickup.user._id.toString() === req.user._id.toString();
    const isDeliveryAgent = pickup.deliveryAgent && pickup.deliveryAgent._id.toString() === req.user._id.toString();

    if (!isOwner && !isDeliveryAgent) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view this pickup'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        pickup
      }
    });
  } catch (error) {
    console.error('Get pickup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching pickup details'
    });
  }
});

module.exports = router;
