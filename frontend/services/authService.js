import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, apiUtils } from './apiService';

// Authentication service with backend integration
export const authService = {
  // Login function - supports (email, password) or ({ email, password, role })
  login: async (email, password) => {
    try {
      let payload;
      if (typeof email === 'object' && email !== null) {
        payload = { email: email.email, password: email.password, role: email.role };
      } else {
        payload = { email, password };
      }
      console.log('Login attempt', { email: payload.email, hasPassword: !!payload.password, role: payload.role });

      const response = await authAPI.login(payload);

      if (response.status === 'success') {
        const { user, token } = response.data;

        // Store auth data
        await apiUtils.storeAuthData(token, user);

        console.log(`${user.role} login successful`);
        return { success: true, user, token };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message };
    }
  },

  // Register function
  register: async (userData) => {
    try {
      console.log('Registration attempt:', userData);

      const response = await authAPI.register(userData);

      if (response.status === 'success') {
        const { user, token } = response.data;

        // Store auth data
        await apiUtils.storeAuthData(token, user);

        console.log(`${user.role} registration successful`);
        return { success: true, user, token };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message };
    }
  },

  // Logout function
  logout: async () => {
    try {
      await apiUtils.clearAuthData();
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { userData } = await apiUtils.getStoredAuthData();
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const { token, userData } = await apiUtils.getStoredAuthData();

      if (!token || !userData) {
        return false;
      }

      // Verify token with backend
      try {
        await authAPI.verifyToken();
        return true;
      } catch (error) {
        // Token is invalid, clear stored data
        await apiUtils.clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await authAPI.verifyToken();
      if (response.status === 'success') {
        // Update stored user data
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      const errorInfo = apiUtils.handleError(error);
      return { success: false, message: errorInfo.message };
    }
  }
};
