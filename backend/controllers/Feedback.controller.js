import FeedbackModel from "../models/FeedbackModel.js";
import FeedbackQuestionModel from "../models/FeedbackQuestionModel.js";

// Public: list all feedback questions
export const listFeedbackQuestions = async (req, res) => {
  try {
    const questions = await FeedbackQuestionModel.find().select("question createdAt");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Authenticated feedback (user info saved)
export const submitAuthFeedback = async (req, res) => {
  try {
    const { message, questionId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!questionId) {
      return res.status(400).json({ message: "questionId is required" });
    }

    const question = await FeedbackQuestionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const feedback = new FeedbackModel({
      message,
      questionId,
      user: req.user.id,   
      isAnonymous: false
    });

    await feedback.save();
    res.status(201).json({
      message: "Feedback submitted (authenticated)",
      feedback
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitAnonymousFeedback = async (req, res) => {
  try {
    const { message, questionId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!questionId) {
      return res.status(400).json({ message: "questionId is required" });
    }

    // ensure question exists
    const question = await FeedbackQuestionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const feedback = new FeedbackModel({
      message,
      questionId,
      user: null,          // DO NOT store user for anonymity
      isAnonymous: true
    });

    await feedback.save();
    res.status(201).json({
      message: "Feedback submitted (anonymous)",
      feedback
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Delete a feedback question
// This will only delete the question if it has no associated feedback
// to maintain data integrity
export const deleteFeedbackQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if any feedback exists for this question
    const feedbackExists = await FeedbackModel.exists({ questionId: id });
    if (feedbackExists) {
      return res.status(400).json({ 
        success: false,
        message: "Cannot delete question that has feedback responses" 
      });
    }

   const deletedQuestion = await FeedbackQuestionModel.findByIdAndDelete(id);
    
    if (!deletedQuestion) {
      return res.status(404).json({ 
        success: false,
        message: "Question not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Question deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

