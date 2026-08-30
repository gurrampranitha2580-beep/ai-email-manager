import mongoose from 'mongoose';

export const AI_HISTORY_TYPES = {
  SUMMARY: 'SUMMARY',
  REPLY: 'REPLY',
};

const aiHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    emailId: { type: String, default: null },
    threadId: { type: String, default: null },
    type: {
      type: String,
      required: true,
      enum: Object.values(AI_HISTORY_TYPES),
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

aiHistorySchema.index({ userId: 1, createdAt: -1 });

export const AIHistory = mongoose.model('AIHistory', aiHistorySchema);
