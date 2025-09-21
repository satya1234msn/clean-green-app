const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  label: {
    type: String,
    required: [true, 'Address label is required'],
    trim: true
  },
  houseFlatBlock: {
    type: String,
    required: [true, 'House/Flat/Block number is required'],
    trim: true
  },
  apartmentRoadArea: {
    type: String,
    required: [true, 'Apartment/Road/Area is required'],
    trim: true
  },
  landmark: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  fullAddress: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index for user and isDefault
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, isActive: 1 });

// Generate full address before saving
addressSchema.pre('save', function(next) {
  if (this.isModified('houseFlatBlock') || this.isModified('apartmentRoadArea') || 
      this.isModified('city') || this.isModified('state') || this.isModified('pincode')) {
    this.fullAddress = `${this.houseFlatBlock}, ${this.apartmentRoadArea}, ${this.city}, ${this.state} - ${this.pincode}`;
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema);
