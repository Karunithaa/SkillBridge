import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: {
    type: [String],
    default: [],
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Users", userSchema);
