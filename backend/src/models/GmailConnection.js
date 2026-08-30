import mongoose from 'mongoose';

export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  EXPIRED: 'expired',
};

const gmailConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    googleAccountEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    encryptedAccessToken: {
      type: String,
      required: true,
      select: false,
    },
    encryptedRefreshToken: {
      type: String,
      default: '',
      select: false,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
    scopes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(CONNECTION_STATUS),
      default: CONNECTION_STATUS.CONNECTED,
    },
  },
  { timestamps: true }
);

gmailConnectionSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    googleAccountEmail: this.googleAccountEmail,
    status: this.status,
    scopes: this.scopes,
    connectedAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const GmailConnection = mongoose.model(
  'GmailConnection',
  gmailConnectionSchema
);
