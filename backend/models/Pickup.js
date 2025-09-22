const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  wasteType: {
    type: String,
    enum: ['food', 'bottles', 'other', 'mixed'],
    required: true
  },
  wasteDetails: {
    foodBoxes: {
      type: Number,
      default: 0
    },
    bottles: {
      type: Number,
      default: 0
    },
    otherItems: {
      type: String,
      default: ''
    }
  },
  images: [{
    type: String,
    required: true
  }],
  scheduledDate: {
    type: Date,
    default: null
  },
  scheduledTime: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'admin_approved', 'admin_rejected', 'awaiting_agent', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminApproval: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    rejectedAt: { type: Date, default: null },
    reason: { type: String, default: null }
  },
  priority: {
    type: String,
    enum: ['now', 'scheduled'],
    required: true
  },
  estimatedWeight: {
    type: Number,
    default: 0
  },
  actualWeight: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  distance: {
    type: Number,
    default: 0
  },
  pickupLocation: {
    latitude: Number,
    longitude: Number
  },
  warehouseLocation: {
    latitude: Number,
    longitude: Number
  },
  route: {
    waypoints: [{
      latitude: Number,
      longitude: Number
    }],
    distance: Number,
    duration: Number
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    notes: String
  }],
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    review: {
      type: String,
      default: null
    },
    ratedAt: {
      type: Date,
      default: null
    }
  },
  notes: {
    user: String,
    delivery: String,
    admin: String
  }
}, {
  timestamps: true
});

// Index for better query performance
pickupSchema.index({ user: 1, status: 1 });
pickupSchema.index({ deliveryAgent: 1, status: 1 });
pickupSchema.index({ status: 1, priority: 1 });
pickupSchema.index({ scheduledDate: 1 });
pickupSchema.index({ createdAt: -1 });

// Virtual for formatted address
pickupSchema.virtual('formattedAddress').get(function() {
  if (this.populated('address')) {
    const addr = this.address;
    return `${addr.houseFlatBlock}, ${addr.apartmentRoadArea}, ${addr.city}, ${addr.state} ${addr.pincode}`;
  }
  return null;
});

// Method to calculate earnings based on distance and waste type
pickupSchema.methods.calculateEarnings = function() {
  const baseRate = 50; // Base rate in rupees
  const distanceRate = this.distance * 2; // 2 rupees per km
  const weightRate = this.estimatedWeight * 5; // 5 rupees per kg
  
  this.earnings = Math.round(baseRate + distanceRate + weightRate);
  return this.earnings;
};

// Method to calculate points based on waste type and weight
pickupSchema.methods.calculatePoints = function() {
  let points = 0;
  
  switch (this.wasteType) {
    case 'food':
      points = this.wasteDetails.foodBoxes * 10;
      break;
    case 'bottles':
      points = this.wasteDetails.bottles * 15;
      break;
    case 'other':
      points = 20; // Base points for other items
      break;
    case 'mixed':
      points = (this.wasteDetails.foodBoxes * 10) + (this.wasteDetails.bottles * 15) + 20;
      break;
  }
  
  this.points = points;
  return this.points;
};

module.exports = mongoose.model('Pickup', pickupSchema);
