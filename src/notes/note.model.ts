import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  note: string;
  sharedTo: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  note: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    maxlength: [5000, 'Note cannot exceed 5000 characters']
  },
  sharedTo: [{
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid email addresses']
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Updated by user is required']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving (only during updates)
NoteSchema.pre<INote>('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Create indexes for better search performance
NoteSchema.index({ title: 'text', note: 'text' });
NoteSchema.index({ createdBy: 1 });
NoteSchema.index({ sharedTo: 1 });

// Create and export the model
const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;