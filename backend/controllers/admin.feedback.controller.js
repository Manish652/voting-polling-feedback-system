import FeedbackModel from "../models/FeedbackModel.js";
import FeedbackQuestionModel from "../models/FeedbackQuestionModel.js";


export const createFeedbackQuestion = async (req,res)=>{
  try{
    const {question} = req.body;
    if(!question || !question.trim()){
      return res.status(400).json({ message: "Question is required" });
    }
    const newQuestion = await FeedbackQuestionModel.create({
      question
    });
    res.status(201).json(newQuestion);
  }catch(err){
    res.status(500).json({
      message: err.message
    });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find()
      .populate("user", "name email")
      .populate("questionId", "question");

    const sanitized = feedbacks.map(fb => ({
      _id: fb._id,
      question: fb.questionId?.question,
      message: fb.message,
      createdAt: fb.createdAt,
      isAnonymous: fb.isAnonymous,
      user: fb.isAnonymous ? null : fb.user
    }));

    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: delete a feedback submission by ID
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeedbackModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a feedback question by ID (admin)
export const deleteFeedbackQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await FeedbackQuestionModel.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Feedback question not found" });
    }

    // Optionally, remove any feedbacks tied to this question to keep data clean
    await FeedbackModel.deleteMany({ questionId: id });

    res.json({ message: "Feedback question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
