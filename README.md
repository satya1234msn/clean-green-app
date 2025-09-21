# CleanGreen App - Waste Management System

A comprehensive waste management application with user and delivery agent interfaces, built with React Native and Node.js.

## Features

### User Features
- **Authentication**: Login/Register with email and password
- **Dashboard**: View stats, recent uploads, rewards, and contribution trends
- **Waste Upload**: Upload photos and details of waste items (food, bottles, other)
- **Address Management**: Add, edit, delete, and switch between multiple addresses
- **Current Location**: Automatically get address from GPS coordinates
- **Pickup Scheduling**: Schedule pickups for specific dates and times
- **Real-time Tracking**: Track delivery agent location and progress
- **Rewards System**: Earn points and redeem coupons for waste contributions
- **Rating System**: Rate delivery agents after pickup completion

### Delivery Agent Features
- **Authentication**: Separate login/register system for delivery agents
- **Online/Offline Status**: Toggle availability for pickup requests
- **Pickup Management**: Accept/reject pickup requests with 20-second timer
- **Route Navigation**: Get optimized routes to user locations and warehouse
- **Earnings Tracking**: View earnings history and request withdrawals
- **Document Upload**: Upload license, insurance, and vehicle documents
- **Rating System**: Receive ratings from users

## Tech Stack

### Frontend
- **React Native** with Expo
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Location** for GPS functionality
- **React Native Maps** for map integration
- **Expo Image Picker** for photo uploads
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.IO** for real-time notifications
- **Cloudinary** for image storage
- **OpenStreetMap APIs** for geocoding and routing
- **Bcrypt** for password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Expo CLI
- React Native development environment

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cleangreen
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional packages**
   ```bash
   npx expo install @react-native-async-storage/async-storage
   npx expo install expo-location
   npx expo install expo-image-picker
   npx expo install react-native-maps
   npx expo install axios
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/history` - Get pickup history
- `PUT /api/users/online-status` - Update online status (delivery agents)

### Pickups
- `POST /api/pickups` - Create pickup request
- `GET /api/pickups/available` - Get available pickups
- `PUT /api/pickups/:id/accept` - Accept pickup request
- `PUT /api/pickups/:id/reject` - Reject pickup request
- `PUT /api/pickups/:id/status` - Update pickup status
- `POST /api/pickups/:id/rate` - Rate completed pickup

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `POST /api/addresses/geocode` - Geocode coordinates

### Rewards
- `GET /api/rewards` - Get user rewards
- `PUT /api/rewards/:id/redeem` - Redeem reward
- `GET /api/rewards/stats` - Get reward statistics

### Uploads
- `POST /api/uploads/image` - Upload single image
- `POST /api/uploads/multiple` - Upload multiple images
- `POST /api/uploads/delivery-documents` - Upload delivery documents

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: String (user/delivery),
  addresses: [ObjectId],
  defaultAddress: ObjectId,
  totalPoints: Number,
  totalPickups: Number,
  // Delivery specific
  vehicleType: String,
  licenseNumber: String,
  rating: { average: Number, count: Number },
  earnings: { total: Number, available: Number, withdrawn: Number }
}
```

### Pickup Model
```javascript
{
  user: ObjectId,
  deliveryAgent: ObjectId,
  address: ObjectId,
  wasteType: String,
  wasteDetails: Object,
  images: [String],
  status: String,
  priority: String,
  scheduledDate: Date,
  points: Number,
  earnings: Number,
  distance: Number,
  timeline: [Object],
  rating: Object
}
```

## Test Credentials

After running the seed script, you can use these test accounts:

### Users
- **Email**: john@example.com
- **Password**: password123

- **Email**: jane@example.com
- **Password**: password123

### Delivery Agents
- **Email**: mike@example.com
- **Password**: password123

- **Email**: sarah@example.com
- **Password**: password123

## Key Features Implementation

### Real-time Notifications
- Uses Socket.IO for real-time pickup notifications
- Delivery agents receive pickup requests instantly
- Users get notified when pickup is accepted/completed

### Route Optimization
- Integrates with OpenStreetMap APIs for routing
- Calculates optimal routes via roads (not direct lines)
- Provides distance and duration estimates

### Image Upload
- Uses Cloudinary for image storage and optimization
- Supports multiple image uploads
- Automatic image compression and resizing

### Location Services
- GPS-based current location detection
- Reverse geocoding to get address from coordinates
- Address validation and formatting

## Development Notes

### File Structure
```
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── scripts/         # Database seeding
│   └── server.js        # Main server file
├── frontend/
│   ├── components/      # Reusable components
│   ├── pages/          # Screen components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API services
│   └── theme/          # Styling and colors
└── README.md
```

### Environment Variables
Make sure to set up all required environment variables in the backend `config.env` file, especially:
- MongoDB connection string
- JWT secret key
- Cloudinary credentials (for image uploads)

### API Integration
The frontend uses a centralized API service (`apiService.js`) that handles:
- Authentication token management
- Request/response interceptors
- Error handling
- Base URL configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
