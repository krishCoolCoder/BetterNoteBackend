const mongoose = require('mongoose');

// Replace with your actual connection string
const mongoURI = 'mongodb+srv://tasktodouser:tasktodouser@tasktodo.ir517qa.mongodb.net/BetterNote';

// Function to connect to MongoDB
export async function connectDB () {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

// module.exports = connectDB;
