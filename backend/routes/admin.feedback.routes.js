import express from "express";
import { 
  createFeedbackQuestion, 
  getAllFeedback, 
  deleteFeedback,
  deleteFeedbackQuestion
} from "../controllers/admin.feedback.controller.js";
import { protectAdmin } from "../middleware/adminAuth.js";
const adminFeedbackRouter = express.Router();

adminFeedbackRouter.post("/createFeedbackQuestion", protectAdmin, createFeedbackQuestion);

adminFeedbackRouter.get("/getAllFeedback", protectAdmin, getAllFeedback);

adminFeedbackRouter.delete("/deleteFeedback/:id", protectAdmin, deleteFeedback);

adminFeedbackRouter.delete("/deleteQuestion/:id", protectAdmin, deleteFeedbackQuestion);

export default adminFeedbackRouter;
