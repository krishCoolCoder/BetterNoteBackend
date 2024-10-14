const mongoose = require('mongoose');

// Define a schema for your collection
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: false
  },
  password : {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  updatedBy: {
    type: Date
  }
});

// Create a model
const User = mongoose.model('User', UserSchema);

module.exports = User;
