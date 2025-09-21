const express = require('express');
const Reward = require('../models/Reward');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rewards
// @desc    Get user rewards
// @access  Private
router.get('/', protect, restrictTo('user'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    let query = { user: req.user._id };
    
    // Filter by status
    if (status === 'active') {
      query.isRedeemed = false;
      query.expiryDate = { $gt: new Date() };
    } else if (status === 'expired') {
      query.expiryDate = { $lte: new Date() };
    } else if (status === 'redeemed') {
      query.isRedeemed = true;
    }

    const rewards = await Reward.find(query)
      .sort({ issuedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reward.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        rewards,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching rewards'
    });
  }
});

// @route   PUT /api/rewards/:id/redeem
// @desc    Redeem a reward
// @access  Private
router.put('/:id/redeem', protect, restrictTo('user'), async (req, res) => {
  try {
    const reward = await Reward.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reward) {
      return res.status(404).json({
        status: 'error',
        message: 'Reward not found'
      });
    }

    if (reward.isExpired) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon has expired'
      });
    }

    if (reward.isRedeemed) {
      return res.status(400).json({
        status: 'error',
        message: 'This coupon has already been redeemed'
      });
    }

    await reward.redeem();

    res.status(200).json({
      status: 'success',
      message: 'Coupon redeemed successfully',
      data: {
        reward
      }
    });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while redeeming reward'
    });
  }
});

// @route   GET /api/rewards/stats
// @desc    Get reward statistics
// @access  Private
router.get('/stats', protect, restrictTo('user'), async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Reward.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalRewards: { $sum: 1 },
          activeRewards: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$isRedeemed', false] }, { $gt: ['$expiryDate', new Date()] }] },
                1,
                0
              ]
            }
          },
          redeemedRewards: {
            $sum: {
              $cond: [{ $eq: ['$isRedeemed', true] }, 1, 0]
            }
          },
          expiredRewards: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$isRedeemed', false] }, { $lte: ['$expiryDate', new Date()] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: stats[0] || {
          totalRewards: 0,
          activeRewards: 0,
          redeemedRewards: 0,
          expiredRewards: 0
        }
      }
    });
  } catch (error) {
    console.error('Get reward stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching reward statistics'
    });
  }
});

module.exports = router;
