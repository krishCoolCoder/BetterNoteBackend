import mongoose, { Schema, Document } from 'mongoose';

export interface IAudit extends Document {
  _id: mongoose.Types.ObjectId;
  apiRoute: string;
  apiMethod: string;
  apiRequestBody: any;
  apiResponse: any;
  statusCode: number;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const AuditSchema: Schema = new Schema({
  apiRoute: {
    type: String,
    required: true,
    trim: true
  },
  apiMethod: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    trim: true
  },
  apiRequestBody: {
    type: Schema.Types.Mixed,
    default: {}
  },
  apiResponse: {
    type: Schema.Types.Mixed,
    default: {}
  },
  statusCode: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
AuditSchema.index({ timestamp: -1 });
AuditSchema.index({ apiRoute: 1 });
AuditSchema.index({ statusCode: 1 });

const Audit = mongoose.model<IAudit>('Audit', AuditSchema);

export default Audit;

