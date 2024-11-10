import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('Database connection test successful');

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('Please ensure:');
    console.log('1. MongoDB is running');
    console.log('2. Connection string in .env file is correct');
    console.log('3. Database user has correct permissions');
    process.exit(1);
  }
}; 