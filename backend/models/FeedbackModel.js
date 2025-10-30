// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedbackQuestion",
    required: true
  },

  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: function() { return !this.isAnonymous; }
  },

  message: {
    type: String,
    required: true
  },

  isAnonymous: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
export default FeedbackModel;
