import mongoose from 'mongoose';

// ============================================
// DATABASE CONNECTION FUNCTION
// ============================================
const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`   📍 Connection URI: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET'}`);
    
    // Connect to MongoDB with Mongoose
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   🏠 Host: ${conn.connection.host}`);
    console.log(`   📦 Database: ${conn.connection.name}`);
    console.log(`   🔌 Port: ${conn.connection.port}`);
    console.log(`   📊 Ready State: ${conn.connection.readyState} (1 = connected)`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   💥 Error Message: ${error.message}`);
    console.error(`   📚 Stack Trace: ${error.stack}`);
    
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
