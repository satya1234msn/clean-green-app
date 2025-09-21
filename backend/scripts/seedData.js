const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('../models/User');
const Address = require('../models/Address');
const Pickup = require('../models/Pickup');
const Reward = require('../models/Reward');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

console.log('🔌 Connecting to MongoDB...');
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting seed data creation...');

    // Clear existing data
    await User.deleteMany({});
    await Address.deleteMany({});
    await Pickup.deleteMany({});
    await Reward.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create test users with proper password hashing
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        password: 'password123',
        role: 'user',
        totalPoints: 150,
        totalPickups: 5
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+919876543211',
        password: 'password123',
        role: 'user',
        totalPoints: 200,
        totalPickups: 8
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+919876543212',
        password: 'password123',
        role: 'delivery',
        vehicleType: 'bike',
        licenseNumber: 'DL123456789',
        rating: { average: 4.5, count: 25 },
        earnings: { total: 2500, available: 500, withdrawn: 2000 },
        completedPickups: 25,
        isOnline: true
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+919876543213',
        password: 'password123',
        role: 'delivery',
        vehicleType: 'scooter',
        licenseNumber: 'DL987654321',
        rating: { average: 4.8, count: 30 },
        earnings: { total: 3000, available: 800, withdrawn: 2200 },
        completedPickups: 30,
        isOnline: false
      }
    ];

    // Create users one by one to ensure password hashing works
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save(); // This will trigger the password hashing middleware
      createdUsers.push(user);
    }
    console.log('👥 Created users');

    // Create addresses for users
    const addresses = [
      {
        user: createdUsers[0]._id,
        name: 'Home',
        houseFlatBlock: '123',
        apartmentRoadArea: 'Main Street, Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        fullAddress: '123, Main Street, Downtown, Mumbai, Maharashtra 400001',
        coordinates: { latitude: 19.0760, longitude: 72.8777 },
        isDefault: true
      },
      {
        user: createdUsers[0]._id,
        name: 'Office',
        houseFlatBlock: '456',
        apartmentRoadArea: 'Business District',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        fullAddress: '456, Business District, Mumbai, Maharashtra 400002',
        coordinates: { latitude: 19.0760, longitude: 72.8777 },
        isDefault: false
      },
      {
        user: createdUsers[1]._id,
        name: 'Home',
        houseFlatBlock: '789',
        apartmentRoadArea: 'Residential Area',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        fullAddress: '789, Residential Area, Delhi, Delhi 110001',
        coordinates: { latitude: 28.7041, longitude: 77.1025 },
        isDefault: true
      }
    ];

    const createdAddresses = await Address.insertMany(addresses);
    console.log('🏠 Created addresses');

    // Create pickup requests
    const pickups = [
      {
        user: createdUsers[0]._id,
        address: createdAddresses[0]._id,
        wasteType: 'food',
        wasteDetails: { foodBoxes: 3, bottles: 0, otherItems: '' },
        images: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
        ],
        status: 'completed',
        priority: 'now',
        points: 30,
        earnings: 80,
        distance: 2.5,
        deliveryAgent: createdUsers[2]._id,
        timeline: [
          { status: 'pending', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { status: 'accepted', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
          { status: 'in_progress', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
          { status: 'completed', timestamp: new Date(Date.now() - 30 * 60 * 1000) }
        ],
        rating: { score: 5, review: 'Great service!', ratedAt: new Date(Date.now() - 25 * 60 * 1000) }
      },
      {
        user: createdUsers[0]._id,
        address: createdAddresses[0]._id,
        wasteType: 'bottles',
        wasteDetails: { foodBoxes: 0, bottles: 10, otherItems: '' },
        images: [
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
        ],
        status: 'rejected',
        priority: 'now',
        points: 0,
        earnings: 0,
        distance: 0,
        timeline: [
          { status: 'pending', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
          { status: 'rejected', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000) }
        ]
      },
      {
        user: createdUsers[1]._id,
        address: createdAddresses[2]._id,
        wasteType: 'mixed',
        wasteDetails: { foodBoxes: 2, bottles: 5, otherItems: 'Old newspapers and magazines' },
        images: [
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
        ],
        status: 'pending',
        priority: 'now',
        points: 0,
        earnings: 0,
        distance: 0
      },
      {
        user: createdUsers[0]._id,
        address: createdAddresses[0]._id,
        wasteType: 'other',
        wasteDetails: { foodBoxes: 0, bottles: 0, otherItems: 'Electronic waste and old clothes' },
        images: [
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400'
        ],
        status: 'accepted',
        priority: 'scheduled',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        scheduledTime: '10:00 to 11:00',
        points: 0,
        earnings: 0,
        distance: 0,
        deliveryAgent: createdUsers[3]._id,
        timeline: [
          { status: 'pending', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
          { status: 'accepted', timestamp: new Date(Date.now() - 30 * 60 * 1000) }
        ]
      }
    ];

    const createdPickups = await Pickup.insertMany(pickups);
    console.log('🗑️ Created pickup requests');

    // Create rewards
    const rewards = [
      {
        user: createdUsers[0]._id,
        pickup: createdPickups[0]._id,
        type: 'pickup_completion',
        title: 'Waste Pickup Completed',
        description: 'You earned 30 points for your food waste pickup',
        couponCode: 'CLEAN2024001',
        partner: 'Zomato',
        discount: '50% off',
        minOrder: '₹200',
        issuedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        pointsEarned: 30,
        icon: '🍕'
      },
      {
        user: createdUsers[0]._id,
        type: 'milestone',
        title: 'Eco Warrior Badge',
        description: 'Completed 5 successful pickups',
        couponCode: 'SWIGGY20',
        partner: 'Swiggy',
        discount: '20% off',
        minOrder: '₹150',
        issuedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        pointsEarned: 50,
        icon: '🌱'
      },
      {
        user: createdUsers[1]._id,
        type: 'special_achievement',
        title: 'Green Champion',
        description: 'Top contributor this month',
        couponCode: 'AMAZON15',
        partner: 'Amazon',
        discount: '15% off',
        minOrder: '₹500',
        issuedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
        pointsEarned: 100,
        icon: '🏆'
      },
      {
        user: createdUsers[0]._id,
        type: 'pickup_completion',
        title: 'Waste Pickup Completed',
        description: 'You earned 20 points for your bottle waste pickup',
        couponCode: 'ECO10',
        partner: 'CleanGreen',
        discount: '10% off',
        minOrder: '₹100',
        issuedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
        pointsEarned: 20,
        icon: '♻️'
      }
    ];

    const createdRewards = await Reward.insertMany(rewards);
    console.log('🎁 Created rewards');

    // Update user addresses
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      addresses: [createdAddresses[0]._id, createdAddresses[1]._id],
      defaultAddress: createdAddresses[0]._id
    });

    await User.findByIdAndUpdate(createdUsers[1]._id, {
      addresses: [createdAddresses[2]._id],
      defaultAddress: createdAddresses[2]._id
    });

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Addresses: ${createdAddresses.length}`);
    console.log(`- Pickups: ${createdPickups.length}`);
    console.log(`- Rewards: ${createdRewards.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Users:');
    console.log('- john@example.com / password123');
    console.log('- jane@example.com / password123');
    console.log('Delivery Agents:');
    console.log('- mike@example.com / password123');
    console.log('- sarah@example.com / password123');

  } catch (error) {
    console.error('❌ Error creating seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
