import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import getEnvVars from '../config';

const { API_BASE_URL } = getEnvVars();

// Create axios instance with better timeout and error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with better error handling
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`
      });

      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }

    // Better error messages
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      error.userMessage = 'Network connection failed. Please check your internet connection and try again.';
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timeout. Please try again.';
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

// Upload API with proper FormData handling
export const uploadAPI = {
  // Upload single image with proper error handling
  uploadImage: async (imageUri) => {
    try {
      console.log('Starting image upload for URI:', imageUri);

      const formData = new FormData();

      // Handle different image URI formats
      let imageFile = {
        uri: imageUri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      };

      // For React Native, we need to handle the image differently
      if (imageUri && typeof imageUri === 'object' && imageUri.uri) {
        imageFile = {
          uri: imageUri.uri,
          type: imageUri.type || 'image/jpeg',
          name: imageUri.fileName || `image_${Date.now()}.jpg`,
        };
      }

      formData.append('image', imageFile);

      console.log('FormData created, making API call...');

      const response = await api.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for image upload
        transformRequest: (data, headers) => {
          // Don't stringify FormData
          return data;
        },
      });

      console.log('Image upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Image upload error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response
      });
      throw error;
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (imageUris) => {
    try {
      const formData = new FormData();
      imageUris.forEach((uri, index) => {
        formData.append('images', {
          uri: uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });

      const response = await api.post('/uploads/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      console.error('Multiple images upload error:', error);
      throw error;
    }
  },
};

// Address API - User-specific addresses
export const addressAPI = {
  // Get user's addresses only
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Create new address for current user
  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update user's address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response.data;
  },

  // Delete user's address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  },

  // Set default address for user
  setDefaultAddress: async (addressId) => {
    const response = await api.put(`/addresses/${addressId}/default`);
    return response.data;
  },

  // Geocode coordinates to address
  geocodeAddress: async (latitude, longitude) => {
    const response = await api.post('/addresses/geocode', {
      latitude,
      longitude,
    });
    return response.data;
  },

  // Search addresses (like Zomato/Swiggy)
  searchAddresses: async (query) => {
    const response = await api.get(`/addresses/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// User API - Ensure user-specific data
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get user-specific dashboard data
  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },

  // Get user's pickup history
  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/users/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Update online status (for delivery agents)
  updateOnlineStatus: async (isOnline) => {
    const response = await api.put('/users/online-status', { isOnline });
    return response.data;
  },
};

// Pickup API - User-specific pickups
export const pickupAPI = {
  // Create pickup request for current user
  createPickup: async (pickupData) => {
    const response = await api.post('/pickups', pickupData);
    return response.data;
  },

  // Get current user's pickups
  getUserPickups: async (status = 'all') => {
    const response = await api.get(`/pickups/user?status=${status}`);
    return response.data;
  },

  // Get pickup details (only if user owns it)
  getPickupDetails: async (pickupId) => {
    const response = await api.get(`/pickups/${pickupId}`);
    return response.data;
  },

  // Rate pickup (only for user's pickups)
  ratePickup: async (pickupId, rating, review) => {
    const response = await api.post(`/pickups/${pickupId}/rate`, {
      rating,
      review,
    });
    return response.data;
  },

  // Get available pickups (for delivery agents)
  getAvailablePickups: async () => {
    const response = await api.get('/pickups/available');
    return response.data;
  },

  // Accept pickup request (for delivery agents)
  acceptPickup: async (pickupId) => {
    const response = await api.put(`/pickups/${pickupId}/accept`);
    return response.data;
  },

  // Update pickup status (for delivery agents)
  updatePickupStatus: async (pickupId, status, location, notes) => {
    const response = await api.put(`/pickups/${pickupId}/status`, {
      status,
      location,
      notes,
    });
    return response.data;
  },
};

// Reward API - User-specific rewards
export const rewardAPI = {
  // Get current user's rewards
  getRewards: async (page = 1, limit = 10, status = 'all') => {
    const response = await api.get(`/rewards?page=${page}&limit=${limit}&status=${status}`);
    return response.data;
  },

  // Redeem user's reward
  redeemReward: async (rewardId) => {
    const response = await api.put(`/rewards/${rewardId}/redeem`);
    return response.data;
  },

  // Get user's reward statistics
  getRewardStats: async () => {
    const response = await api.get('/rewards/stats');
    return response.data;
  },
};

const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  verifyToken: () => api.post('/auth/verify-token').then(res => res.data),
};

const apiUtils = {
  storeAuthData: async (token, user) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  },
  getStoredAuthData: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      return { token, userData };
    } catch (error) {
      console.error('Error getting stored auth data:', error);
      return { token: null, userData: null };
    }
  },
  clearAuthData: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
  handleError: (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return { message: error.response.data.message };
    }
    return { message: error.message || 'An unknown error occurred' };
  }
};

const exportedAPIs = {
  authAPI,
  apiUtils,
  userAPI,
  addressAPI,
  pickupAPI,
  rewardAPI,
  uploadAPI
};

export default api;
export { exportedAPIs as defaultAPIs };
