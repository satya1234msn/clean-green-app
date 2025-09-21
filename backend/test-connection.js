const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      process.exit(1);
    }
    
    console.log('Connection string:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    const result = await testCollection.findOne({ test: 'connection' });
    console.log('✅ Database read test successful!');
    
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database delete test successful!');
    
    console.log('\n🎉 All tests passed! Your MongoDB setup is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running locally, or');
    console.log('2. Use MongoDB Atlas (cloud) and update MONGODB_URI in config.env');
    console.log('3. Check your connection string format');
    console.log('4. Verify network connectivity');
  } finally {
    mongoose.connection.close();
  }
}

testConnection();
