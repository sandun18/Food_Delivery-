import mongoose from 'mongoose';

/**
 * Connect to MongoDB with robust error handling
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('❌ Error: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);

    // Listen for connection events after initial connection
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Runtime Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected! Attempting reconnection or check network.');
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB!');
    console.error(`🚨 Error Details: ${error.message}`);
    // Terminate process with failure code
    process.exit(1);
  }
};

export default connectDB;
