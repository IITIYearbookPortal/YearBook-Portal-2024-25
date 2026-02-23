const mongoose = require("mongoose");

const PendingMemoriesSchema = new mongoose.Schema(
  {
    memoryGroupIds: {
      type: [String],
      default: [],
    },
    seniorEmail: {
      type: String,
      required: true,
      unique: true, 
      index: true,
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
  },
);

module.exports = mongoose.model("PendingMemory", PendingMemoriesSchema);
