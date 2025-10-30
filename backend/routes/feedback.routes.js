import express from "express";
import { submitAuthFeedback, submitAnonymousFeedback, listFeedbackQuestions } from "../controllers/Feedback.controller.js";

import protect from "../middleware/auth.js";

const feedbackRouter = express.Router();

// public list of questions
feedbackRouter.get("/questions", listFeedbackQuestions);
feedbackRouter.post("/submit/auth", protect, submitAuthFeedback);
feedbackRouter.post("/submit/anonymous", submitAnonymousFeedback);


export default feedbackRouter;
