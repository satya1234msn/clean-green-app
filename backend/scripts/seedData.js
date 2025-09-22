const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

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
    console.log('🌱 Seeding admin user only (non-destructive)...');

    // Ensure admin exists; do not remove any existing data
    const adminEmail = 'admin@cleangreen.com';
    const adminPassword = 'Admin@12345';

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log('✅ Admin already exists:', adminEmail);
    } else {
      admin = new User({
        name: 'Admin User',
        email: adminEmail,
        phone: '+919999999999',
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Created admin user:', adminEmail);
    }

    console.log('\n🔑 Admin Credentials:');
    console.log(`- ${adminEmail} / ${adminPassword}`);

  } catch (error) {
    console.error('❌ Error creating seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
