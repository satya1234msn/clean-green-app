const express = require('express');
const { body, validationResult } = require('express-validator');
const Address = require('../models/Address');
const { protect, restrictTo } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// @route   GET /api/addresses
// @desc    Get user addresses
// @access  Private
router.get('/', protect, restrictTo('user'), async (req, res) => {
  try {
    const addresses = await Address.find({ 
      user: req.user._id, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        addresses
      }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching addresses'
    });
  }
});

// @route   POST /api/addresses
// @desc    Create a new address
// @access  Private
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Address name must be between 2 and 50 characters'),
  body('houseFlatBlock').trim().notEmpty().withMessage('House/Flat/Block number is required'),
  body('apartmentRoadArea').trim().notEmpty().withMessage('Apartment/Road/Area is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
  body('coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
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
      name,
      houseFlatBlock,
      apartmentRoadArea,
      city,
      state,
      pincode,
      coordinates
    } = req.body;

    // Create full address string
    const fullAddress = `${houseFlatBlock}, ${apartmentRoadArea}, ${city}, ${state} ${pincode}`;

    const addressData = {
      user: req.user._id,
      name,
      houseFlatBlock,
      apartmentRoadArea,
      city,
      state,
      pincode,
      fullAddress,
      coordinates
    };

    // Check if this is the first address (make it default)
    const existingAddresses = await Address.countDocuments({ 
      user: req.user._id, 
      isActive: true 
    });
    
    if (existingAddresses === 0) {
      addressData.isDefault = true;
    }

    const address = new Address(addressData);
    await address.save();

    res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: {
        address
      }
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating address'
    });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update an address
// @access  Private
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('houseFlatBlock').optional().trim().notEmpty(),
  body('apartmentRoadArea').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim().notEmpty(),
  body('pincode').optional().matches(/^\d{6}$/),
  body('coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('coordinates.longitude').optional().isFloat({ min: -180, max: 180 })
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

    const address = await Address.findOne({ 
      _id: req.params.id, 
      user: req.user._id, 
      isActive: true 
    });

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    const allowedUpdates = [
      'name', 'houseFlatBlock', 'apartmentRoadArea', 
      'city', 'state', 'pincode', 'coordinates'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update full address if any address components changed
    if (updates.houseFlatBlock || updates.apartmentRoadArea || 
        updates.city || updates.state || updates.pincode) {
      const houseFlatBlock = updates.houseFlatBlock || address.houseFlatBlock;
      const apartmentRoadArea = updates.apartmentRoadArea || address.apartmentRoadArea;
      const city = updates.city || address.city;
      const state = updates.state || address.state;
      const pincode = updates.pincode || address.pincode;
      
      updates.fullAddress = `${houseFlatBlock}, ${apartmentRoadArea}, ${city}, ${state} ${pincode}`;
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: {
        address: updatedAddress
      }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating address'
    });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete an address
// @access  Private
router.delete('/:id', protect, restrictTo('user'), async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id, 
      user: req.user._id, 
      isActive: true 
    });

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    // Soft delete the address
    address.isActive = false;
    await address.save();

    // If this was the default address, make another address default
    if (address.isDefault) {
      const nextAddress = await Address.findOne({ 
        user: req.user._id, 
        isActive: true,
        _id: { $ne: address._id }
      });
      
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting address'
    });
  }
});

// @route   PUT /api/addresses/:id/default
// @desc    Set an address as default
// @access  Private
router.put('/:id/default', protect, restrictTo('user'), async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id, 
      user: req.user._id, 
      isActive: true 
    });

    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    // Remove default from all other addresses
    await Address.updateMany(
      { user: req.user._id, _id: { $ne: address._id } },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      status: 'success',
      message: 'Default address updated successfully',
      data: {
        address
      }
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while setting default address'
    });
  }
});

// @route   POST /api/addresses/geocode
// @desc    Get address from coordinates
// @access  Private
router.post('/geocode', [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
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

    const { latitude, longitude } = req.body;

    try {
      // Use Nominatim for reverse geocoding
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'CleanGreen-App/1.0'
        }
      });

      const data = response.data;
      
      if (!data || !data.address) {
        return res.status(400).json({
          status: 'error',
          message: 'Could not determine address from coordinates'
        });
      }

      const address = data.address;
      const fullAddress = data.display_name;
      
      // Parse address components
      const parsedAddress = {
        houseFlatBlock: address.house_number || address.building || '',
        apartmentRoadArea: address.road || address.suburb || address.neighbourhood || '',
        city: address.city || address.town || address.village || address.county || '',
        state: address.state || address.region || '',
        pincode: address.postcode || '',
        fullAddress: fullAddress,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      };

      res.status(200).json({
        status: 'success',
        data: {
          address: parsedAddress
        }
      });
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError);
      res.status(400).json({
        status: 'error',
        message: 'Failed to get address from coordinates'
      });
    }
  } catch (error) {
    console.error('Geocode address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while geocoding address'
    });
  }
});

module.exports = router;
