import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },

  answerText: {
    type: String,
    required: true,
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
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  points: {
    type: Number,
    default: 0,
  },

  answers: [answerSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Posts", postSchema);