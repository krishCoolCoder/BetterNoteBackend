import mongoose, { Schema, Document } from 'mongoose';

export interface INodes extends Document {
  _id: mongoose.Types.ObjectId;
  nodes: any;
  edges: any;
  noteId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NodesSchema: Schema = new Schema({
  nodes: {
    type: Schema.Types.Mixed,
    required: [true, 'Nodes data is required']
  },
  edges: {
    type: Schema.Types.Mixed,
    required: [true, 'Edges data is required']
  },
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
    required: [true, 'Note ID reference to notes is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
NodesSchema.index({ noteId: 1 });
NodesSchema.index({ createdAt: -1 });

// Create and export the model
const Nodes = mongoose.model<INodes>('Nodes', NodesSchema);

export default Nodes;
