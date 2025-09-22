const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const { protect, restrictTo, requireOnline } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/deliveries/available
// @desc    Get available pickup requests for delivery agents
// @access  Private
router.get('/available', protect, restrictTo('delivery'), requireOnline, async (req, res) => {
  try {
    const availablePickups = await Pickup.find({
      status: { $in: ['admin_approved', 'awaiting_agent'] },
      priority: 'now',
      deliveryAgent: null
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

// @route   GET /api/deliveries/my-pickups
// @desc    Get delivery agent's assigned pickups
// @access  Private
router.get('/my-pickups', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    
    let query = { deliveryAgent: req.user._id };
    
    if (status !== 'all') {
      query.status = status;
    }

    const pickups = await Pickup.find(query)
      .populate('user', 'name phone')
      .populate('address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        pickups
      }
    });
  } catch (error) {
    console.error('Get my pickups error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching pickups'
    });
  }
});

// @route   PUT /api/deliveries/online-status
// @desc    Update delivery agent online status
// @access  Private
router.put('/online-status', [
  body('isOnline').isBoolean().withMessage('Online status must be a boolean')
], protect, restrictTo('delivery'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

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

// @route   GET /api/deliveries/earnings
// @desc    Get delivery agent earnings
// @access  Private
router.get('/earnings', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const userId = req.user._id;

    // Get earnings by date
    const earningsByDate = await Pickup.aggregate([
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

    // Get total earnings
    const totalEarnings = await Pickup.aggregate([
      { $match: { deliveryAgent: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$earnings' } } }
    ]);

    // Get last order earnings
    const lastOrder = await Pickup.findOne({
      deliveryAgent: userId,
      status: 'completed'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        earnings: earningsByDate,
        totalEarnings: totalEarnings[0]?.total || 0,
        lastOrderEarnings: lastOrder?.earnings || 0,
        availableBalance: req.user.earnings.available
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching earnings'
    });
  }
});

// @route   POST /api/deliveries/withdraw
// @desc    Request earnings withdrawal
// @access  Private
router.post('/withdraw', [
  body('amount').isFloat({ min: 1 }).withMessage('Withdrawal amount must be at least ₹1'),
  body('paymentMethod').isIn(['bank_transfer', 'upi']).withMessage('Valid payment method is required'),
  body('paymentDetails').isObject().withMessage('Payment details are required')
], protect, restrictTo('delivery'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, paymentMethod, paymentDetails } = req.body;

    if (amount > req.user.earnings.available) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient balance for withdrawal'
      });
    }

    // Create withdrawal transaction
    const Transaction = require('../models/Transaction');
    const transaction = new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount: -amount, // Negative for withdrawal
      description: `Withdrawal request via ${paymentMethod}`,
      status: 'pending',
      paymentMethod,
      paymentDetails,
      referenceId: `WD${Date.now()}`
    });

    await transaction.save();

    // Update user's available balance
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'earnings.available': -amount,
        'earnings.withdrawn': amount
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Withdrawal request submitted successfully',
      data: {
        transaction
      }
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while processing withdrawal'
    });
  }
});

module.exports = router;
