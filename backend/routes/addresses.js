const express = require('express');
const Address = require('../models/Address');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// Get user's addresses
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch addresses'
    });
  }
});

// Create new address for current user
router.post('/', protect, async (req, res) => {
  try {
    const {
      label,
      houseFlatBlock,
      apartmentRoadArea,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault
    } = req.body;

    // Validation
    if (!label || !houseFlatBlock || !apartmentRoadArea || !city || !state || !pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'All required fields must be provided'
      });
    }

    // If this is set as default, update all other addresses to not be default
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    // Create new address
    const address = new Address({
      user: req.user._id,
      label,
      houseFlatBlock,
      apartmentRoadArea,
      landmark,
      city,
      state,
      pincode,
      latitude: latitude || 0,
      longitude: longitude || 0,
      isDefault: isDefault || false,
      fullAddress: `${houseFlatBlock}, ${apartmentRoadArea}, ${city}, ${state} - ${pincode}`
    });

    await address.save();

    // Update user's addresses array and default address
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { addresses: address._id },
      ...(isDefault && { defaultAddress: address._id })
    });

    res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create address'
    });
  }
});

// Update user's address
router.put('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    const {
      label,
      houseFlatBlock,
      apartmentRoadArea,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault
    } = req.body;

    // If this is set as default, update all other addresses to not be default
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    // Update address
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      {
        label,
        houseFlatBlock,
        apartmentRoadArea,
        landmark,
        city,
        state,
        pincode,
        latitude: latitude || address.latitude,
        longitude: longitude || address.longitude,
        isDefault: isDefault || false,
        fullAddress: `${houseFlatBlock}, ${apartmentRoadArea}, ${city}, ${state} - ${pincode}`
      },
      { new: true }
    );

    // Update user's default address if needed
    if (isDefault) {
      await User.findByIdAndUpdate(req.user._id, {
        defaultAddress: updatedAddress._id
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update address'
    });
  }
});

// Delete user's address
router.delete('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    // Don't allow deletion of default address if it's the only address
    const userAddressCount = await Address.countDocuments({ user: req.user._id });
    if (address.isDefault && userAddressCount === 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete the only address'
      });
    }

    await Address.findByIdAndDelete(req.params.id);
    
    // Remove from user's addresses array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { addresses: req.params.id },
      ...(address.isDefault && { $unset: { defaultAddress: 1 } })
    });

    // If deleted address was default, set another address as default
    if (address.isDefault && userAddressCount > 1) {
      const newDefaultAddress = await Address.findOneAndUpdate(
        { user: req.user._id },
        { isDefault: true },
        { new: true }
      );
      
      if (newDefaultAddress) {
        await User.findByIdAndUpdate(req.user._id, {
          defaultAddress: newDefaultAddress._id
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete address'
    });
  }
});

// Set default address
router.put('/:id/default', protect, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!address) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    // Update all addresses to not be default
    await Address.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );

    // Set this address as default
    await Address.findByIdAndUpdate(req.params.id, { isDefault: true });
    
    // Update user's default address
    await User.findByIdAndUpdate(req.user._id, {
      defaultAddress: req.params.id
    });

    res.status(200).json({
      status: 'success',
      message: 'Default address updated successfully'
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to set default address'
    });
  }
});

// Geocode coordinates to address
router.post('/geocode', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'error',
        message: 'Latitude and longitude are required'
      });
    }

    // Use OpenStreetMap Nominatim for reverse geocoding
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
      }
    });

    if (response.data && response.data.address) {
      const addr = response.data.address;
      
      res.status(200).json({
        status: 'success',
        data: {
          displayName: response.data.display_name,
          area: addr.neighbourhood || addr.suburb || addr.village || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          country: addr.country || '',
          latitude,
          longitude
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Address not found for the given coordinates'
      });
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to geocode address'
    });
  }
});

// Search addresses (like Zomato/Swiggy)
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 3 characters'
      });
    }

    // Use OpenStreetMap Nominatim for address search
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: q,
        format: 'json',
        addressdetails: 1,
        limit: 10,
        countrycodes: 'in' // Restrict to India
      }
    });

    if (response.data && response.data.length > 0) {
      const results = response.data.map(item => {
        const addr = item.address;
        return {
          displayName: item.display_name,
          area: addr.neighbourhood || addr.suburb || addr.village || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          importance: item.importance
        };
      });
      
      res.status(200).json({
        status: 'success',
        data: results
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: []
      });
    }
  } catch (error) {
    console.error('Error searching addresses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search addresses'
    });
  }
});

module.exports = router;
