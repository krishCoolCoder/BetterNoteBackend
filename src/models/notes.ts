import mongoose from "mongoose";

// Define a schema for notes collection
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  body: {
    type: String,
    required: false
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
const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
