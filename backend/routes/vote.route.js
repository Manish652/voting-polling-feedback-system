import express from "express";
import { castVote, getResults, getUserVote } from "../controllers/vote.Controller.js";
import protect from "../middleware/auth.js";

const voteRouter = express.Router();

voteRouter.post("/cast", protect, castVote);
voteRouter.get("/results", getResults);
voteRouter.get("/myvote", protect, getUserVote);

export default voteRouter;
