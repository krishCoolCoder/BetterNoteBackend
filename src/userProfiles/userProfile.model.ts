import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userRefId: mongoose.Types.ObjectId;
  userProfile?: string;
  headerColor?: string;
  sidebarColor?: string;
  appTitle?: string;
  allowAnonymousView: boolean;
  showOnlySharedNotes: boolean;
  fontStyle?: string;
  allowLinkSharing?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

const UserProfileSchema: Schema = new Schema({
  userRefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  userProfile: {
    type: String,
    required: false,
    trim: true
  },
  headerColor: {
    type: String,
    required: false,
    trim: true
  },
  sidebarColor: {
    type: String,
    required: false,
    trim: true
  },
  appTitle: {
    type: String,
    required: false,
    trim: true
  },
  allowAnonymousView: {
    type: Boolean,
    default: false
  },
  showOnlySharedNotes: {
    type: Boolean,
    default: true
  },
  fontStyle: {
    type: String,
    required: false,
    trim: true
  },
  allowLinkSharing: {
    type: String,
    required: false,
    trim: true
  },
  createdBy: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving
UserProfileSchema.pre<IUserProfile>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the model
const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile;

