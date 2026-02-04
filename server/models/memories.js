const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
      required: true,
      index: true,
    },

    seniorId: {
      type: String,
      required: true,
      index: true,
    },

    authorName: {
      type: String,
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 500,
    },

    images: {
      type: [String],
      default: [],
    },
    groupId: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model('Memory', MemorySchema);
