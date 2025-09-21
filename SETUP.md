# CleanGreen App Setup Guide

## Quick Start

### Option 1: Using MongoDB Atlas (Cloud) - Recommended

1. **Create a free MongoDB Atlas account** at https://www.mongodb.com/atlas
2. **Create a new cluster** (free tier available)
3. **Get your connection string** from Atlas dashboard
4. **Update backend/config.env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cleangreen?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB Installation

#### Windows:
1. **Download MongoDB Community Server** from https://www.mongodb.com/try/download/community
2. **Install MongoDB** with default settings
3. **Start MongoDB service**:
   ```bash
   net start MongoDB
   ```
4. **Verify installation**:
   ```bash
   mongod --version
   ```

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Copy `config.env` and update MongoDB URI
   - Add your JWT secret key
   - Configure Cloudinary (optional, for image uploads)

4. **Start backend server**:
   ```bash
   npm run dev
   ```

5. **Seed the database** (in a new terminal):
   ```bash
   cd backend
   npm run seed
   ```

## Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   npx expo install @react-native-async-storage/async-storage axios
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

## Testing the Setup

### Test Backend API
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "CleanGreen API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Frontend
1. Open Expo Go app on your phone
2. Scan the QR code from the terminal
3. Try logging in with test credentials:
   - **User**: john@example.com / password123
   - **Delivery**: mike@example.com / password123

## Troubleshooting

### MongoDB Connection Issues
- **Error**: `ECONNREFUSED ::1:27017`
- **Solution**: Make sure MongoDB is running locally or use MongoDB Atlas

### Backend Not Starting
- **Check**: Node.js version (should be 14+)
- **Check**: All dependencies installed (`npm install`)
- **Check**: Environment variables in `config.env`

### Frontend Connection Issues
- **Check**: Backend is running on port 5000
- **Check**: API base URL in `frontend/services/apiService.js`
- **Check**: Network connectivity between frontend and backend

### Image Upload Issues
- **Check**: Cloudinary configuration in `config.env`
- **Check**: Image file size (should be < 10MB)
- **Check**: Supported image formats (JPEG, PNG)

## Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run backend

# Seed database
npm run seed

# Start frontend only
npm start
```

## Environment Variables

### Backend (config.env)
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

### Frontend
- API base URL is configured in `frontend/services/apiService.js`
- Default: `http://localhost:5000/api`
- For physical device testing, use your computer's IP address

## Production Deployment

### Backend
- Use a cloud service like Heroku, Railway, or DigitalOcean
- Set up MongoDB Atlas for production database
- Configure environment variables in production environment

### Frontend
- Build for production using Expo
- Deploy to app stores or as a web app
- Update API URLs for production backend

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running and accessible
4. Check network connectivity between frontend and backend
