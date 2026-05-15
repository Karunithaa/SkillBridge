import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  answerText: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  isBestAnswer: {
    type: Boolean,
    default: false,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  answeredAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Coding", "Design", "Mathematics", "Science", "Information Technology", "Language", "Business", "Other"],
  },
  tags: {
    type: [String],
    default: [],
  },
  points: {
    type: Number,
    default: 10,
  },
  status: {
    type: String,
    enum: ["open", "answered", "closed"],
    default: "open",
  },
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Posts", postSchema);
