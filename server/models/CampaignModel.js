import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  targetAudience: [
    {
      type: String,
      enum: ["Students", "Professionals", "Parents", "Teenagers", "Seniors"],
    },
  ],
  platform: {
    type: String,
    required: true,
    enum: ["Facebook", "Instagram", "Google", "Twitter", "TikTok"],
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Active", "Paused", "Completed"],
    default: "Draft",
  },
  images: [
    {
      type: String, // ImageKit URLs
    },
  ],
  spent: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
