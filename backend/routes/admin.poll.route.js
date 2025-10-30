import { protectAdmin } from "../middleware/adminAuth.js";
import express from "express";
import { CreatePoll, getPolls, deletePoll } from "../controllers/addminPoll.controller.js";

const adminPollRouter = express.Router();
adminPollRouter.post("/createPoll", protectAdmin, CreatePoll);
adminPollRouter.get("/getPolls", protectAdmin, getPolls);
adminPollRouter.delete("/:id", protectAdmin, deletePoll);

export default adminPollRouter;
