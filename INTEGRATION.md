# Frontend-Backend Integration Guide

## Overview

This guide explains how the frontend React Native app integrates with the Node.js backend API.

## API Service Architecture

### Core Service (`apiService.js`)

The `frontend/services/apiService.js` file provides a centralized API client with:

- **Axios instance** with base configuration
- **Request interceptors** for automatic token attachment
- **Response interceptors** for error handling
- **Modular API functions** organized by feature

### Authentication Flow

1. **Login/Register**: User credentials sent to `/api/auth/login` or `/api/auth/register`
2. **Token Storage**: JWT token stored in AsyncStorage
3. **Automatic Headers**: Token automatically added to all subsequent requests
4. **Token Verification**: Periodic token validation with backend

### Key Integration Points

## 1. Authentication Integration

### UserProfileSelector.js
```javascript
// Before (Mock)
const result = await authService.login(username, password, role);

// After (Backend)
const email = username.includes('@') ? username : `${username}@example.com`;
const result = await authService.login(email, password);
```

### UserSignup.js
```javascript
// Before (Mock)
alert('Account created successfully!');

// After (Backend)
const result = await authService.register(userData);
if (result.success) {
  // Navigate to dashboard
}
```

## 2. Dashboard Integration

### Dashboard.js
```javascript
// Before (Static data)
const stats = [
  { label: 'Submit', value: '24', icon: '📤', color: '#4CAF50' },
  // ...
];

// After (Dynamic data)
useEffect(() => {
  loadDashboardData();
}, []);

const loadDashboardData = async () => {
  const response = await userAPI.getDashboard();
  setDashboardData(response.data);
};
```

## 3. Address Management Integration

### AddressManagement.js
```javascript
// Current location with geocoding
const getCurrentLocation = async () => {
  const location = await Location.getCurrentPositionAsync();
  const geocodeResult = await addressAPI.geocodeAddress(
    location.coords.latitude,
    location.coords.longitude
  );
  // Auto-fill address fields
};
```

## 4. Pickup Management Integration

### WasteUploadNew.js
```javascript
// Create pickup request
const handleSchedulePickup = async () => {
  const pickupData = {
    address: selectedAddress._id,
    wasteType: selectedWasteType,
    wasteDetails: { foodBoxes, bottles, otherItems },
    images: uploadedImages,
    priority: 'scheduled'
  };
  
  const response = await pickupAPI.createPickup(pickupData);
};
```

## 5. Real-time Features

### Socket.IO Integration
```javascript
// Backend emits events
req.io.to(`user-${pickup.user._id}`).emit('pickup-accepted', {
  pickup: pickup,
  deliveryAgent: pickup.deliveryAgent
});

// Frontend listens for events
useEffect(() => {
  const socket = io('http://localhost:5000');
  
  socket.on('pickup-accepted', (data) => {
    // Update UI with pickup acceptance
  });
  
  return () => socket.disconnect();
}, []);
```

## Data Flow Examples

### 1. User Login Flow
```
UserProfileSelector → authService.login() → authAPI.login() → Backend /api/auth/login
                                                                        ↓
Frontend receives JWT token ← authService stores token ← Backend returns user + token
```

### 2. Dashboard Data Flow
```
Dashboard component → userAPI.getDashboard() → Backend /api/users/dashboard
                                                      ↓
Frontend updates UI ← Dashboard processes data ← Backend returns user stats
```

### 3. Pickup Creation Flow
```
WasteUploadNew → pickupAPI.createPickup() → Backend /api/pickups
                                                      ↓
Frontend shows success ← Backend creates pickup ← Backend validates data
```

## Error Handling

### API Error Interceptor
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      await AsyncStorage.removeItem('authToken');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);
```

### Component Error Handling
```javascript
try {
  const result = await userAPI.getDashboard();
  setDashboardData(result.data);
} catch (error) {
  console.error('Error loading dashboard:', error);
  Alert.alert('Error', 'Failed to load dashboard data');
}
```

## State Management

### Local State with API Integration
```javascript
const [user, setUser] = useState(null);
const [dashboardData, setDashboardData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadUserData();
}, []);

const loadUserData = async () => {
  try {
    setLoading(true);
    const user = await authService.getCurrentUser();
    const dashboard = await userAPI.getDashboard();
    
    setUser(user);
    setDashboardData(dashboard.data);
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

## Image Upload Integration

### Photo Upload Flow
```javascript
// 1. User selects image
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync();
  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri);
  }
};

// 2. Upload to backend
const uploadImage = async () => {
  const response = await uploadAPI.uploadImage(selectedImage);
  setUploadedImages(prev => [...prev, response.data.imageUrl]);
};
```

## Real-time Updates

### Pickup Status Updates
```javascript
// Backend updates pickup status
await Pickup.findByIdAndUpdate(pickupId, { status: 'completed' });

// Emit real-time notification
req.io.to(`user-${pickup.user}`).emit('pickup-completed', {
  pickup,
  points: pickup.points
});

// Frontend receives update
socket.on('pickup-completed', (data) => {
  // Update UI to show completion
  // Show points earned
  // Navigate to rating screen
});
```

## Testing Integration

### API Testing
```javascript
// Test API endpoints
const testAPI = async () => {
  try {
    // Test health endpoint
    const health = await fetch('http://localhost:5000/api/health');
    console.log('Backend health:', await health.json());
    
    // Test authentication
    const login = await authAPI.login('john@example.com', 'password123');
    console.log('Login test:', login);
  } catch (error) {
    console.error('API test failed:', error);
  }
};
```

## Production Considerations

### Environment Configuration
```javascript
// Development
const BASE_URL = 'http://localhost:5000/api';

// Production
const BASE_URL = 'https://your-api-domain.com/api';
```

### Error Monitoring
```javascript
// Log errors for monitoring
const logError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  // Send to error tracking service (Sentry, etc.)
};
```

## Common Integration Patterns

### 1. Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```

### 2. Optimistic Updates
```javascript
// Update UI immediately, rollback on error
const handleLike = async () => {
  const previousLikes = likes;
  setLikes(prev => prev + 1);
  
  try {
    await api.likePost(postId);
  } catch (error) {
    setLikes(previousLikes); // Rollback
    Alert.alert('Error', 'Failed to like post');
  }
};
```

### 3. Retry Logic
```javascript
const apiCallWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

This integration provides a robust, scalable architecture for the CleanGreen app with proper error handling, real-time features, and maintainable code structure.
