import mongoose from 'mongoose';

export const ACTIVITY_ACTIONS = {
  EMAIL_VIEWED: 'EMAIL_VIEWED',
  EMAIL_STARRED: 'EMAIL_STARRED',
  EMAIL_UNSTARRED: 'EMAIL_UNSTARRED',
  EMAIL_ARCHIVED: 'EMAIL_ARCHIVED',
  EMAIL_TRASHED: 'EMAIL_TRASHED',
  EMAIL_MARKED_READ: 'EMAIL_MARKED_READ',
  EMAIL_MARKED_UNREAD: 'EMAIL_MARKED_UNREAD',
  EMAIL_SENT: 'EMAIL_SENT',
  EMAIL_REPLIED: 'EMAIL_REPLIED',
  AI_SUMMARY_GENERATED: 'AI_SUMMARY_GENERATED',
  AI_REPLY_GENERATED: 'AI_REPLY_GENERATED',
};

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: Object.values(ACTIVITY_ACTIONS),
    },
    emailId: { type: String, default: null },
    threadId: { type: String, default: null },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ userId: 1, createdAt: -1 });

activitySchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    action: this.action,
    emailId: this.emailId,
    threadId: this.threadId,
    metadata: this.metadata,
    createdAt: this.createdAt,
  };
};

export const Activity = mongoose.model('Activity', activitySchema);
