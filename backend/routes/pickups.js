const express = require('express');
const Pickup = require('../models/Pickup');
const Address = require('../models/Address');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth'); // Destructure the functions

const router = express.Router();

// Create pickup request (only for current user)
router.post('/', protect, async (req, res) => {
  try {
    const {
      addressId,
      wasteType,
      wasteDetails,
      images,
      scheduledDate,
      scheduledTime,
      priority,
      estimatedWeight
    } = req.body;

    // Validation
    if (!addressId || !wasteType || !images || images.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Address, waste type, and at least one image are required'
      });
    }

    // Verify that the address belongs to the current user
    const address = await Address.findOne({ _id: addressId, user: req.user._id });
    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found or does not belong to you'
      });
    }

    // Create pickup request
    const pickup = new Pickup({
      user: req.user._id,
      address: addressId,
      wasteType,
      wasteDetails,
      images,
      scheduledDate: priority === 'scheduled' ? scheduledDate : null,
      scheduledTime: priority === 'scheduled' ? scheduledTime : null,
      priority,
      estimatedWeight: estimatedWeight || 0,
      pickupLocation: {
        latitude: address.latitude,
        longitude: address.longitude
      }
    });

    // Calculate points and earnings
    pickup.calculatePoints();
    pickup.calculateEarnings();

    await pickup.save();

    // Populate address for response
    await pickup.populate('address user');

    // Emit socket event for available pickups (for delivery agents)
    if (req.io) {
      req.io.emit('new-pickup', {
        pickup: pickup.toObject(),
        message: 'New pickup request available'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Pickup request created successfully',
      data: pickup
    });
  } catch (error) {
    console.error('Error creating pickup:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create pickup request'
    });
  }
});

// Get user's pickups
router.get('/user', protect, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    if (status !== 'all') {
      query.status = status;
    }

    const pickups = await Pickup.find(query)
      .populate('address deliveryAgent')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pickup.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        pickups,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: pickups.length,
          totalRecords: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user pickups:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pickups'
    });
  }
});

// Get available pickups (for delivery agents only)
router.get('/available', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const pickups = await Pickup.find({ 
      status: 'pending',
      deliveryAgent: null 
    })
      .populate('user address')
      .sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: pickups
    });
  } catch (error) {
    console.error('Error fetching available pickups:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch available pickups'
    });
  }
});

// Accept pickup request (for delivery agents)
router.put('/:id/accept', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    
    if (!pickup) {
      return res.status(404).json({
        status: 'error',
        message: 'Pickup not found'
      });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Pickup is no longer available'
      });
    }

    // Update pickup
    pickup.deliveryAgent = req.user._id;
    pickup.status = 'accepted';
    pickup.timeline.push({
      status: 'accepted',
      timestamp: new Date(),
      notes: 'Pickup accepted by delivery agent'
    });

    await pickup.save();
    await pickup.populate('user address deliveryAgent');

    // Notify user via socket
    if (req.io) {
      req.io.to(`user-${pickup.user._id}`).emit('pickup-accepted', {
        pickup: pickup.toObject(),
        message: 'Your pickup has been accepted!'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Pickup accepted successfully',
      data: pickup
    });
  } catch (error) {
    console.error('Error accepting pickup:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to accept pickup'
    });
  }
});

// Other routes follow the same pattern...
// Update pickup status, rate pickup, etc.

module.exports = router;
