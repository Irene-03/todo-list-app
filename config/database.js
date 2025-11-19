// ======================================================================
// MongoDB Database Configuration
// Phase 3: Mongoose Connection
// ======================================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not set in .env file');
      console.log('📖 Please install MongoDB and set MONGODB_URI in .env');
      console.log('   Example: MONGODB_URI=mongodb://localhost:27017/todo-app');
      return null;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('💡 Make sure MongoDB is running: mongod --dbpath /path/to/data');
    console.error('   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    return null;
  }
};

module.exports = connectDB;
