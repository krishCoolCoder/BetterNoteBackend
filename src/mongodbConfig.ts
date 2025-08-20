import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/betternote';
    
    await mongoose.connect(mongoUri, {
      // No need for deprecated options in newer versions of mongoose
    });
    
    console.log('Connected to MongoDB');
    console.log(`Database: ${mongoUri.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;